// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Pong {
	struct Tournament {
		string		name;
		uint256		timestamp;
		address[]	participants;
		address		winner;
		bool		exists;
		mapping(address => uint256) scores;		//mapping player addresses to their score
	}

	//mapping of all tournaments by their ID
	mapping(uint256 => Tournament) public tournaments;
	uint256 public tournamentCount;

	//modifire for tournament existance
	modifier tournamentExists(uint256 _tournament_ID) {
		require(tournaments[_tournament_ID].exists, "Tournament does not exist.");
		_;
	}

	//events for loging contract activites
	event TournamentCreated(uint256 indexed tournament_ID, string name);
	event ScoreRecorder(uint256 indexed tournament_ID, address player, uint256 score);
	event Winner(uint256 indexed tournament_ID, address winner);

	function createTournament(string memory _name) public returns(uint256) {
		uint256 tournament_ID = tournamentCount++;
		Tournament storage t = tournaments[tournament_ID];
		t.name = _name;
		t.timestamp = block.timestamp;
		t.exists = true;

		emit TournamentCreated(tournament_ID, _name);
		return tournament_ID;
	}

	function addParticipants(uint256 _tournament_ID, address _player) public tournamentExists(_tournament_ID) {
		tournaments[_tournament_ID].participants.push(_player);
	}

	function readScore(uint256 _tournament_ID, address _player, uint256 _score) public tournamentExists(_tournament_ID) {
		tournaments[_tournament_ID].scores[_player] = _score;
		emit ScoreRecorder (_tournament_ID, _player, _score);
	}

	function declareWinner(uint256 _tournament_ID, address _winner) public tournamentExists(_tournament_ID) {
		tournaments[_tournament_ID].winner = _winner;
		emit Winner(_tournament_ID, _winner);
	}

	function getParticipants(uint256 _tournament_ID) public view returns(address[] memory) {
		return tournaments[_tournament_ID].participants;
	}

	function getScore(uint256 _tournament_ID, address _player) public view returns(uint256) {
		return tournaments[_tournament_ID].scores[_player];
	}
}
