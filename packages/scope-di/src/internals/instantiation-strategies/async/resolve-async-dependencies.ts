import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { isAsyncDescriptor } from "../../../helpers/descriptor-helpers";
import { RegisteredDependencies } from "../../../types";
import { AllowedDependencyKey } from "../../../types/allowed-dependency-key";
import { DependencyResolutionKey } from "../../../types/dependency-resolution-key";
import { DefaultDiScope } from "../../scope/default-di-scope";

export function resolveAsyncDependencies
(
    scope: DefaultDiScope<RegisteredDependencies>, 
    keys: DependencyResolutionKey<AllowedDependencyKey>[]
)
{
	const asyncDependencies: Promise<any>[] = [];

	const keysLength = keys.length;
	const results: (unknown | unknown[])[] = new Array(keysLength);

	for (let index = 0; index < keysLength; ++index)
	{
		const key = keys[index];

		if (Array.isArray(key))
		{
			const [mappingKey] = key;

			const descriptorsCollection = scope.registry.resolveCollectionDescriptorsByKey(mappingKey);

			const descriptorsLength = descriptorsCollection.length;
			const collection = new Array(descriptorsLength);

			for (let descriptorIndex = 0; descriptorIndex < descriptorsLength; ++descriptorIndex)
			{
				const descriptor = descriptorsCollection[descriptorIndex];

				const value = scope.resolveByDescriptor(descriptor);

				if (!isAsyncDescriptor(descriptor))
					collection[descriptorIndex] = value;
				else if (TrackedPromise.isTracked(value) && value[TrackedPromise.status] === TrackedPromiseStatus.Success)
					collection[descriptorIndex] = value[TrackedPromise.value];
				else
				{
					const awaitAndSetDependency = async () => 
						void (collection[descriptorIndex] = await value);

					asyncDependencies.push(awaitAndSetDependency());
				}
			}

			results[index] = collection;
		}
		else
		{
			const descriptor = scope.registry.resolveSingularDescriptorByKey(key);

			const value = scope.resolveByDescriptor(descriptor);

			if (!isAsyncDescriptor(descriptor))
				results[index] = value;
			else if (TrackedPromise.isTracked(value) && value[TrackedPromise.status] === TrackedPromiseStatus.Success)
				results[index] = value[TrackedPromise.value];
			else
			{
				const awaitAndSetDependency = async () => 
					void (results[index] = await value);

				asyncDependencies.push(awaitAndSetDependency());
			}
		}
	}

	if (asyncDependencies.length > 0)
		return TrackedPromise.track(Promise.all(asyncDependencies).then(() => results));

	return TrackedPromise.resolved(results);
}
