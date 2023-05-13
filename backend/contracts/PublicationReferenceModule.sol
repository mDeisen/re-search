// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IReferenceModule} from "@aave/lens-protocol/contracts/interfaces/IReferenceModule.sol";
import {ModuleBase} from "@aave/lens-protocol/contracts/core/modules/ModuleBase.sol";
import {FollowValidationModuleBase} from "@aave/lens-protocol/contracts/core/modules/FollowValidationModuleBase.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error FollowerOnlyReferenceModule__HIndextTooLow(uint profileId);

/**
 * @title FollowerOnlyReferenceModule
 * @author Lens Protocol
 *
 * @notice A simple reference module that validates that comments or mirrors originate from a profile owned
 * by a follower.
 */
contract FollowerOnlyReferenceModule is FollowValidationModuleBase, IReferenceModule {
    // Mapping of Publicaiton Ids to an Array of Paublication IDs its mentioned in

    struct Article {
        uint author;
        uint[] citesIds;
        uint[] acceptedBy;
    }

    struct Researcher {
        uint[] articles;
    }

    struct IntialiseData {
        uint[] citeIds;
    }

    struct CommentData {
        bool accepted;
    }

    mapping(uint => Article) s_pubsIdToArticle;
    mapping(uint => Researcher) s_profileIdToReseacher;

    uint immutable H_INDEX_THREASHOLD = 2;

    constructor(address hub) ModuleBase(hub) {}

    event Publish(uint profileId, uint pubId, uint[] citeIds);
    event Review(uint profileId, uint profileIdPointed, uint pubIdPointed, bool accepted);

    /**
     * @dev There is nothing needed at initialization.
     */
    function initializeReferenceModule(
        uint256 profileId,
        uint256 pubId,
        bytes calldata data
    ) external override returns (bytes memory) {
        IntialiseData memory args = abi.decode(data, (IntialiseData));
        s_pubsIdToArticle[pubId].citesIds = args.citeIds;
        s_pubsIdToArticle[pubId].author = pubId;
        s_profileIdToReseacher[profileId].articles.push(pubId);
        emit Publish(profileId, pubId, args.citeIds);

        // TODO Check Polygon Id
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
    ) external override {
        address commentCreator = IERC721(HUB).ownerOf(profileId);
        _checkFollowValidity(profileIdPointed, commentCreator);
        CommentData memory args = abi.decode(data, (CommentData));

        bool highHIndex = hIndexOf(profileId) < H_INDEX_THREASHOLD;

        if (highHIndex || isCited(profileId, pubIdPointed)) {
            revert FollowerOnlyReferenceModule__HIndextTooLow(profileIdPointed);
        }

        if (highHIndex && args.accepted) {
            s_pubsIdToArticle[pubIdPointed].acceptedBy.push(profileId);
        }

        emit Review(profileId, profileIdPointed, pubIdPointed, args.accepted);
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

    function hIndexOf(uint256 profileId) private view returns (uint) {
        uint hIndex = 0;
        Researcher memory researcher = s_profileIdToReseacher[profileId];
        uint[] memory pubs = researcher.articles;
        uint totalPubs = pubs.length;

        for (uint i = 0; i < pubs.length; i++) {
            uint numberOfCites = s_pubsIdToArticle[pubs[i]].citesIds.length;
            if (numberOfCites >= totalPubs) {
                hIndex++;
            }
        }

        return hIndex;
    }

    function isCited(uint256 profileId, uint pubId) private view returns (bool) {
        uint[] memory citeIds = s_pubsIdToArticle[pubId].citesIds; // ids

        for (uint i = 0; i < citeIds.length; i++) {
            uint author = s_pubsIdToArticle[citeIds[i]].author;
            if (author == profileId) {
                return true;
            }
        }
        return false;
    }
}
