import { ExternalUserIdAssociatedWithAddress, OpenQ } from "../../generated/OpenQ/OpenQ"
import {
	User
} from "../../generated/schema"

export default function handleExternalUserIdAssociatedWithAddress(event: ExternalUserIdAssociatedWithAddress): void {
	// @dev THESE USERS MIGHT BE THE SAME USER IF THE ADDRESS IS THE SAME. ORDER OF OPERATIONS MATTERS
	let formerUser = User.load(event.params.formerAddress.toHexString())
	let user = User.load(event.params.newAddress.toHexString())

	if (!user) {
		user = new User(event.params.newAddress.toHexString())
		user.save()
	}

	if (!formerUser) {
		formerUser = new User(event.params.formerAddress.toHexString())
		formerUser.save()
	}

	formerUser.externalUserId = null
	user.externalUserId = event.params.newExternalUserId

	// SAVE ALL ENTITIES (ORDER OF OPERATIONS MATTERS)
	formerUser.save()
	user.save()
}