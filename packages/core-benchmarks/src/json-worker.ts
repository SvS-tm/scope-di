import { spawn } from "node:child_process";
import path from "node:path";
import { logBenchmarkProgress } from "./progress.ts";

type WorkerCommand =
{
    executable: string;
    args: string[];
};

export function runJsonWorker<T_Result>
(
    command: WorkerCommand,
    name: string,
    validate: (value: unknown) => T_Result
)
    : Promise<T_Result>
{
    const recoverDenoShutdown =
    (
        process.platform === "win32"
            &&
        path.basename(command.executable).toLowerCase() === "deno.exe"
    );

    return new Promise
    (
        (resolve, reject) =>
        {
            const child = spawn(command.executable, command.args, { stdio: ["ignore", "pipe", "inherit"] });
            let output = "";
            let shutdownDeadline: ReturnType<typeof setTimeout> | undefined;
            let recoveredShutdown = false;

            const cancelDeadline = () =>
            {
                if(shutdownDeadline !== undefined)
                    clearTimeout(shutdownDeadline);

                shutdownDeadline = undefined;
            };

            child.stdout.setEncoding("utf8");
            child.stdout.on
            (
                "data",
                (chunk: string) =>
                {
                    output += chunk;

                    if(!recoverDenoShutdown || shutdownDeadline !== undefined || !output.endsWith("\n"))
                        return;

                    try
                    {
                        validate(JSON.parse(output));
                    }
                    catch
                    {
                        return;
                    }

                    // Only arm after the complete result: measurement has already finished.
                    shutdownDeadline = setTimeout
                    (
                        () =>
                        {
                            try
                            {
                                validate(JSON.parse(output));
                            }
                            catch
                            {
                                return;
                            }

                            recoveredShutdown = child.kill("SIGKILL");

                            if(recoveredShutdown)
                            {
                                logBenchmarkProgress
                                (
                                    `Worker ${child.pid} ${name}: validated result received, but Deno did not exit within 5 seconds; terminated during shutdown.`
                                );
                            }
                        },
                        5_000
                    );
                }
            );
            child.on
            (
                "error",
                (error) =>
                {
                    cancelDeadline();
                    reject(error);
                }
            );
            child.on
            (
                "close",
                (code, signal) =>
                {
                    cancelDeadline();

                    if(code !== 0 && !recoveredShutdown)
                    {
                        reject(new Error(`Worker ${name} failed: ${signal ?? `exit code ${code}`}.`));
                        return;
                    }

                    try
                    {
                        resolve(validate(JSON.parse(output)));
                    }
                    catch(error)
                    {
                        reject(new Error(`Invalid worker output for ${name}.`, { cause: error }));
                    }
                }
            );
        }
    );
}
