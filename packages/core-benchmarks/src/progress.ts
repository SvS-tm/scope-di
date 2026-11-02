export function logBenchmarkProgress(message: string)
{
    console.error(`[${new Date().toISOString()}] ${message}`);
}

function formatElapsed(milliseconds: number)
{
    const seconds = Math.floor(milliseconds / 1000);

    return [Math.floor(seconds / 3600), Math.floor(seconds / 60 % 60), seconds % 60]
        .map(value => value.toString().padStart(2, "0"))
        .join(":");
}

export function createBenchmarkProgress(runtimeArgs: string[], count: number)
{
    const option = (key: string) => runtimeArgs.find(argument => argument.startsWith(`${key}=`))?.slice(key.length + 1);
    const offset = Number(option("--progress-offset") ?? 0);
    const total = Number(option("--progress-total") ?? count);
    const startedAt = Number(option("--progress-started-at") ?? Date.now());
    const runtime = option("--progress-runtime");
    let completed = 0;

    async function measure<T_Result>(name: string, action: () => Promise<T_Result>): Promise<T_Result>
    {
        const caseStartedAt = Date.now();
        const report = (status: string) =>
        {
            const overallCompleted = offset + completed;
            const elapsed = formatElapsed(Date.now() - startedAt);
            const caseElapsed = formatElapsed(Date.now() - caseStartedAt);

            logBenchmarkProgress
            (
                `[total ${overallCompleted}/${total} ${(100 * overallCompleted / total).toFixed(1)}% | elapsed ${elapsed}] ${runtime ? runtime + " " : ""}[completed ${completed}/${count}] ${status} ${name} | case elapsed ${caseElapsed}`
            );
        };

        report("START");

        try
        {
            const result = await action();
            ++completed;
            report("DONE");

            return result;
        }
        catch(error)
        {
            report("FAILED");
            throw error;
        }
    }

    return { measure };
}
