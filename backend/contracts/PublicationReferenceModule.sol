// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IReferenceModule} from "@aave/lens-protocol/contracts/interfaces/IReferenceModule.sol";
import {ModuleBase} from "@aave/lens-protocol/contracts/core/modules/ModuleBase.sol";
import {FollowValidationModuleBase} from "@aave/lens-protocol/contracts/core/modules/FollowValidationModuleBase.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title FollowerOnlyReferenceModule
 * @author Lens Protocol
 *
 * @notice A simple reference module that validates that comments or mirrors originate from a profile owned
 * by a follower.
 */
contract FollowerOnlyReferenceModule is FollowValidationModuleBase, IReferenceModule {
    // Mapping of Publicaiton Ids to an Array of Paublication IDs its mentioned in
    mapping(uint => uint[]) profileIdToPublicationIds;
    mapping(uint => uint[]) publicationIdToMonthionIds;

    constructor(address hub) ModuleBase(hub) {}

    event Publish(uint256 profileId, uint256 pubId, uint[] citeIds);

    /**
     * @dev There is nothing needed at initialization.
     */
    function initializeReferenceModule(
        uint256 profileId,
        uint256 pubId,
        bytes calldata data
    ) external override returns (bytes memory) {
        uint[] memory citeIds = abi.decode(data, (uint[]));
        publicationIdToMonthionIds[pubId] = citeIds;
        profileIdToPublicationIds[profileId].push(pubId);
        emit Publish(profileId, pubId, citeIds);
        return new bytes(0);
    }

    /**
     * @notice Validates that the commenting profile's owner is a follower.
     *
     * NOTE: We don't need to care what the pointed publication is in this context.
     */
    function processComment(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed,
        bytes calldata data
    ) external view override {
        address commentCreator = IERC721(HUB).ownerOf(profileId);
        _checkFollowValidity(profileIdPointed, commentCreator);

        //to do only H Indedx > 2
    }

    /**
     * @notice Validates that the commenting profile's owner is a follower.
     *
     * NOTE: We don't need to care what the pointed publication is in this context.
     */
    function processMirror(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed,
        bytes calldata data
    ) external view override {
        address mirrorCreator = IERC721(HUB).ownerOf(profileId);
        _checkFollowValidity(profileIdPointed, mirrorCreator);
    }

    function calcHIndex(uint256 profileId) private view returns (uint) {
        uint hIndex = 0;
        uint[] memory pubs = profileIdToPublicationIds[profileId];
        uint totalPubs = 0;

        for (uint i = 0; i < pubs.length; i++) {
            if (publicationIdToMonthionIds[pubs[i]].length >= totalPubs) {
                hIndex++;
            }
        }

        return hIndex;
    }
}
