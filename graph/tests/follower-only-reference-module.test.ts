import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt } from "@graphprotocol/graph-ts"
import { Publish } from "../generated/schema"
import { Publish as PublishEvent } from "../generated/FollowerOnlyReferenceModule/FollowerOnlyReferenceModule"
import { handlePublish } from "../src/follower-only-reference-module"
import { createPublishEvent } from "./follower-only-reference-module-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let profileId = BigInt.fromI32(234)
    let pubId = BigInt.fromI32(234)
    let citeIds = [BigInt.fromI32(234)]
    let newPublishEvent = createPublishEvent(profileId, pubId, citeIds)
    handlePublish(newPublishEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Publish created and stored", () => {
    assert.entityCount("Publish", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Publish",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "profileId",
      "234"
    )
    assert.fieldEquals(
      "Publish",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pubId",
      "234"
    )
    assert.fieldEquals(
      "Publish",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "citeIds",
      "[234]"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
