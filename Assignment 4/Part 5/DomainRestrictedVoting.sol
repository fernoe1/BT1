// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DomainRestrictedVoting {
    address public admin;
    string public allowedDomain; 

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
    }

    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    mapping(string => Voter) public voters; 

    event CandidateAdded(uint candidateId, string name);
    event VoterRegistered(string email);
    event VoteCast(string email, uint candidateId);
    event AllowedDomainChanged(string newDomain);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor(string memory _domain) {
        admin = msg.sender;
        allowedDomain = _domain;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(_name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function _validateEmailDomain(string memory _email) internal view returns (bool) {
        bytes memory emailBytes = bytes(_email);
        bytes memory domainBytes = bytes(allowedDomain);

        if (emailBytes.length < domainBytes.length) {
            return false;
        }

        for (uint i = 0; i < domainBytes.length; i++) {
            if (emailBytes[emailBytes.length - domainBytes.length + i] != domainBytes[i]) {
                return false;
            }
        }

        return true;
    }

    function registerVoter(string memory _email) public onlyAdmin {
        require(_validateEmailDomain(_email), "Email not in allowed domain");
        require(!voters[_email].isRegistered, "Voter already registered");

        voters[_email] = Voter(true, false);
        emit VoterRegistered(_email);
    }

    function vote(string memory _email, uint _candidateId) public {
        require(_validateEmailDomain(_email), "Email not in allowed domain");
        require(voters[_email].isRegistered, "Voter not registered");
        require(!voters[_email].hasVoted, "Voter already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[_email].hasVoted = true;
        candidates[_candidateId].voteCount++;

        emit VoteCast(_email, _candidateId);
    }

    function getVotes(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");
        
        return candidates[_candidateId].voteCount;
    }
}
