import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  Publish,
  Review
} from "../generated/Contract/Contract"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPublishEvent(
  profileId: BigInt,
  pubId: BigInt,
  citeIds: Array<BigInt>
): Publish {
  let publishEvent = changetype<Publish>(newMockEvent())

  publishEvent.parameters = new Array()

  publishEvent.parameters.push(
    new ethereum.EventParam(
      "profileId",
      ethereum.Value.fromUnsignedBigInt(profileId)
    )
  )
  publishEvent.parameters.push(
    new ethereum.EventParam("pubId", ethereum.Value.fromUnsignedBigInt(pubId))
  )
  publishEvent.parameters.push(
    new ethereum.EventParam(
      "citeIds",
      ethereum.Value.fromUnsignedBigIntArray(citeIds)
    )
  )

  return publishEvent
}

export function createReviewEvent(
  profileId: BigInt,
  profileIdPointed: BigInt,
  pubIdPointed: BigInt,
  accepted: boolean
): Review {
  let reviewEvent = changetype<Review>(newMockEvent())

  reviewEvent.parameters = new Array()

  reviewEvent.parameters.push(
    new ethereum.EventParam(
      "profileId",
      ethereum.Value.fromUnsignedBigInt(profileId)
    )
  )
  reviewEvent.parameters.push(
    new ethereum.EventParam(
      "profileIdPointed",
      ethereum.Value.fromUnsignedBigInt(profileIdPointed)
    )
  )
  reviewEvent.parameters.push(
    new ethereum.EventParam(
      "pubIdPointed",
      ethereum.Value.fromUnsignedBigInt(pubIdPointed)
    )
  )
  reviewEvent.parameters.push(
    new ethereum.EventParam("accepted", ethereum.Value.fromBoolean(accepted))
  )

  return reviewEvent
}
