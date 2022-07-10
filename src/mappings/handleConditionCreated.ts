import { BigInt } from "@graphprotocol/graph-ts"
import { ConditionCreated } from "../../generated/Core/Core"
import {
	Condition,
	Metric
} from "../../generated/schema"

export default function handleConditionCreated(event: ConditionCreated): void {
	let condition = Condition.load(event.params.conditionId.toString())

	if (!condition) {
		condition = new Condition(event.params.conditionId.toString())
		condition.save()
	}

	condition.timestamp = event.params.timestamp
	condition.save()

	let metrics = Metric.load('metrics')

	if (!metrics) {
		metrics = new Metric('metrics')
		metrics.save()
	}

	metrics.count = metrics.count.plus(BigInt.fromString('1'))
	metrics.save()
}