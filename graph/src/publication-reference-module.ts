import { log } from "@graphprotocol/graph-ts" 
import {
  OwnershipTransferred as OwnershipTransferredEvent,
  PublicationReferenceModule,
  Publish as PublishEvent,
  Review as ReviewEvent
} from "../generated/PublicationReferenceModule/PublicationReferenceModule"
import { Profile, Publication, Review } from "../generated/schema"

export function handlePublish(event: PublishEvent): void {
  // Update Profile
  let profile = Profile.load(event.params.profileId.toString())

  if (profile == null) {
    profile = new Profile(event.params.profileId.toString())
  }

  profile = updateHScore(profile, event)
  profile.save()

  // Update Publication
  let entity = new Publication(
    event.params.pubId.toString()
  )

  entity.profile = profile.id 
  entity.id = event.params.pubId.toString()
  entity.citedPublications = event.params.citeIds.map<string>(x => x.toString())
  entity.title = event.params.title
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Update citedPublications
  for (let i = 0; i < event.params.citeIds.length; i++) {
    let citedPublication = Publication.load(event.params.citeIds[i].toString())
    if (citedPublication == null) {
      continue
    }
    citedPublication.citedByPublications.push(entity.id)
    citedPublication.save()
    // Update h score of cited author
    let citedAuthor = Profile.load(citedPublication.profile)
    if (citedAuthor == null) { 
      continue
    }
    citedAuthor = updateHScore(citedAuthor, event)
    citedAuthor.save()
  }
}

export function handleReview(event: ReviewEvent): void {

  // Create Review
  let entity = new Review(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reviewAuthorProfile = event.params.profileId.toString()
  entity.publicationAuthorProfile = event.params.profileIdPointed.toString()
  entity.accepted = event.params.accepted

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

// Function that takes profile, calls smart contract and updates hScore
export function updateHScore(profile: Profile, event: PublishEvent): Profile {
  let smartContractCall = PublicationReferenceModule.bind(event.address).try_hIndexOf(event.params.profileId)
  if (smartContractCall.reverted) {
    profile.hScore = 0
  } else {
    profile.hScore = smartContractCall.value.toU32()
  }
  return profile
}