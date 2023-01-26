import { log, ethereum } from "@graphprotocol/graph-ts";
import { InvoiceCompleteSet } from "../../generated/OpenQ/OpenQ";
import { Bounty } from "../../generated/schema";
import Constants from "../utils";
import { addTuplePrefix } from '../utils';

export default function handleInvoiceCompleteSet(
  event: InvoiceCompleteSet
): void {
  let bounty = Bounty.load(event.params.bountyAddress.toHexString());

  if (!bounty) {
    throw "Error";
  }

  let bountyType = event.params.bountyType;

  if (bountyType == Constants.ATOMIC) {
    let decoded = ethereum.decode("(bool)", event.params.data);

    if (decoded == null) {
      return;
    }

    let decodedTuple = decoded.toTuple();

    const invoiceCompleted = decodedTuple[0].toBoolean();

    bounty.invoiceCompleted = invoiceCompleted ? [invoiceCompleted] : null;
  } else {
    let decoded = ethereum.decode("(bool[])", addTuplePrefix(event.params.data));

    if (decoded == null) {
      return;
    }

    let decodedTuple = decoded.toTuple();
    bounty.invoiceCompleted = decodedTuple[0].toBooleanArray();
  }

  // SAVE ALL ENTITIES
  bounty.save();
}
