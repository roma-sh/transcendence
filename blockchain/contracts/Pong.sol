// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Pong {
	struct Tournament {
		string		name;
		uint256		timestamp;
		address[]	participants;
		address		winner;
		bool		exists;
		address		creator;
		bool		finalized;
		mapping(address => uint256) scores;		//mapping player addresses to their score
		mapping(address => bool) isParticipant;
	}

	//mapping of all tournaments by their ID
	mapping(uint256 => Tournament) public tournaments;
	uint256 public tournamentCount;

	//modifire for tournament existance
	modifier tournamentExists(uint256 _tournament_ID) {
		require(tournaments[_tournament_ID].exists, "Tournament does not exist.");
		_;
	}

	//events for logging contract activities
	event TournamentCreated(uint256 indexed tournament_ID, string name, address creator);
	event ParticipantAdded(uint256 indexed tournament_ID, address player);
	event ScoreRecorded(uint256 indexed tournament_ID, address player, uint256 score);
	event TournamentFinalized(uint256 indexed tournament_ID, address winner);

	function createTournament(string memory _name) public returns(uint256) {
		uint256 tournament_ID = tournamentCount++;
		Tournament storage t = tournaments[tournament_ID];
		t.name = _name;
		t.timestamp = block.timestamp;
		t.exists = true;
		t.creator = msg.sender;
		t.finalized = false;

		emit TournamentCreated(tournament_ID, _name, msg.sender);
		return tournament_ID;
	}

	function addParticipants(uint256 _tournament_ID, address _player) public tournamentExists(_tournament_ID) {
		Tournament storage t = tournaments[_tournament_ID];
		require(msg.sender == t.creator, "Only creator");
		require(!t.finalized, "Finalized");
		require(!t.isParticipant[_player], "Already added");
		t.participants.push(_player);
		t.isParticipant[_player] = true;
		emit ParticipantAdded(_tournament_ID, _player);
	}

	function recordScore(uint256 _tournament_ID, address _player, uint256 _score) public tournamentExists(_tournament_ID) {
		Tournament storage t = tournaments[_tournament_ID];
		require(!t.finalized, "Finalized");
		// Allow organizer or player themselves to record their score
		require(msg.sender == t.creator || msg.sender == _player, "Not authorized");
		require(t.isParticipant[_player], "Not participant");
		t.scores[_player] = _score;
		emit ScoreRecorded(_tournament_ID, _player, _score);
	}

	function declareWinner(uint256 _tournament_ID, address _winner) public tournamentExists(_tournament_ID) {
		Tournament storage t = tournaments[_tournament_ID];
		require(msg.sender == t.creator, "Only creator");
		require(!t.finalized, "Finalized");
		require(t.isParticipant[_winner], "Winner not participant");
		t.winner = _winner;
		t.finalized = true;
		emit TournamentFinalized(_tournament_ID, _winner);
	}

	function getParticipants(uint256 _tournament_ID) public view returns(address[] memory) {
		return tournaments[_tournament_ID].participants;
	}

	function getScore(uint256 _tournament_ID, address _player) public view returns(uint256) {
		return tournaments[_tournament_ID].scores[_player];
	}

	function getTournament(uint256 _tournament_ID) public view returns (
		string memory name,
		uint256 timestamp,
		address creator,
		address winner,
		bool finalized,
		uint256 participantsCount
	) {
		Tournament storage t = tournaments[_tournament_ID];
		require(t.exists, "Tournament does not exist.");
		return (t.name, t.timestamp, t.creator, t.winner, t.finalized, t.participants.length);
	}
}
