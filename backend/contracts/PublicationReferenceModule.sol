// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IReferenceModule} from "@aave/lens-protocol/contracts/interfaces/IReferenceModule.sol";
import {ModuleBase} from "@aave/lens-protocol/contracts/core/modules/ModuleBase.sol";
import {FollowValidationModuleBase} from "@aave/lens-protocol/contracts/core/modules/FollowValidationModuleBase.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error PublicationReferenceModule__HIndextTooLow(uint profileId);

/**
 * @title PublicationReferenceModule
 * @author Sean Pleaner, Nezzar Kefif, Mattis Deisen
 *
 * @notice Reference Module to encapsulate the relationships between Articles, Reseacrchers and the logic for review.
 *
 */
contract PublicationReferenceModule is Ownable, FollowValidationModuleBase, IReferenceModule {
    /////////////////////////
    /// Type Declarations  //
    /////////////////////////

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
        string title;
        string lensPostCid;
    }

    struct CommentData {
        bool accepted;
    }

    ///////////////////////
    /// State Variables  //
    ///////////////////////

    mapping(uint => Article) s_pubsIdToArticle;
    mapping(uint => Researcher) s_profileIdToReseacher;
    uint immutable H_INDEX_THREASHOLD = 2;
    bool requireHIndexFlag = false;

    //////////////
    /// Events  //
    //////////////

    event Publish(uint profileId, uint pubId, uint[] citeIds, string title, string lensPostCid);
    event Review(uint profileId, uint profileIdPointed, uint pubIdPointed, bool accepted);

    /////////////////
    /// Functions  //
    /////////////////

    // constructor
    constructor(address hub) ModuleBase(hub) {}

    // receive function -- none
    // fallback function -- none

    /////////////////
    /// External   //
    /////////////////

    /**
     * @notice Handles the initial publishing of an article.
     * @return nothing to be returnered.
     */
    function initializeReferenceModule(
        uint256 profileId,
        uint256 pubId,
        bytes calldata data
    ) external override returns (bytes memory) {
        IntialiseData memory args = abi.decode(data, (IntialiseData));
        setCiteIds(pubId, args.citeIds);
        setAuthor(pubId, profileId);
        addArticle(profileId, pubId);

        emit Publish(profileId, pubId, args.citeIds, args.title, args.lensPostCid);

        // TODO Check Polygon Id
        return new bytes(0);
    }

    /**
     * @notice Handles the Comment logic
     *
     * @dev comments include call data to determine if the author accepts the paper.
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

        if (requireHIndexFlag || highEngoughHIndex(profileId) || isCited(profileId, pubIdPointed)) {
            revert PublicationReferenceModule__HIndextTooLow(profileIdPointed);
        }

        if (requireHIndexFlag || (highEngoughHIndex(profileId) && args.accepted)) {
            addAccepted(pubIdPointed, profileId);
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

    function hIndexOf(uint256 profileId) public view returns (uint) {
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

    function setRequireHIndexFlag(bool enabled) external onlyOwner {
        requireHIndexFlag = enabled;
    }

    ///////////////
    ///  Public  //
    ///////////////

    ///////////////
    /// Internal //
    ///////////////

    ///////////////
    /// Private  //
    ///////////////

    ///
    /// @dev checks if a publicaiton cites a given Researcher
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

    function setCiteIds(uint pubId, uint[] memory citeIds) private {
        s_pubsIdToArticle[pubId].citesIds = citeIds;
    }

    function setAuthor(uint pubId, uint profileId) private {
        s_pubsIdToArticle[pubId].author = profileId;
    }

    function addArticle(uint profileId, uint pubId) private {
        s_profileIdToReseacher[profileId].articles.push(pubId);
    }

    function highEngoughHIndex(uint profileId) private view returns (bool) {
        return hIndexOf(profileId) >= H_INDEX_THREASHOLD;
    }

    function addAccepted(uint pubId, uint profileId) private {
        s_pubsIdToArticle[pubId].acceptedBy.push(profileId);
    }
}
