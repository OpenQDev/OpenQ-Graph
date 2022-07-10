import { ConditionCreated } from "../../generated/Core/Core"
import {
	User,
	Condition
} from "../../generated/schema"

export default function handleConditionCreated(event: ConditionCreated): void {
	let user = User.load(event.transaction.from.toHexString())

	if (!user) {
		user = new User(event.transaction.from.toHexString())
		user.save()
	}
}