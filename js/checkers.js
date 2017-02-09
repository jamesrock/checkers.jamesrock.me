(function() {

	var 
	body = document.body,
	isAnyOf = function(value, items) {

		var
		isAny = false;

		ROCK.ARRAY.each(items, function(item) {
			if(value===item) {
				isAny = true;
				return "break";
			};
		});

		return isAny;

	},
	Board = ROCK.Object.extend({
		constructor: function Board() {

			this.node = ROCK.DOM.createNode("div");
			this.tiles = this.build();

			ROCK.DOM.addClass(this.node, "board");

		},
		build: function() {

			var
			board = this,
			total = (board.rows*board.cols),
			row = 0,
			col = 0,
			black = false,
			blacks = 1,
			reds = board.reds,
			whites = board.whites,
			tiles = [],
			tile;

			for(var i=0;i<total;i++) {

				tile = new Tile(board, row, col, black, i);

				if(black) {

					if(reds) {
						tile.setState(1);
						reds --;
					};

					if(whites&&i>39) {
						tile.setState(3);
						whites --;
					};

					tile.setId(blacks);

					blacks ++;

				};

				tiles.push(tile);

				black = !black;

				if(col===7) {
					col = 0;
					black = !black;
					row ++;
				}
				else {
					col ++;
				};

			};

			return tiles;

		},
		render: function(to) {

			var
			board = this;

			ROCK.ARRAY.each(this.tiles, function(tile) {

				tile.renderTo(board.node);

			});

			ROCK.DOM.append(this.node, to);			

		},
		reds: 12,
		whites: 12,
		rows: 8,
		cols: 8,
		selected: null
	}),
	Tile = ROCK.Object.extend({
		constructor: function Tile(board, row, col, black, index) {

			var
			tile = this;

			this.board = board;
			this.row = row;
			this.col = col;
			this.black = black;
			this.index = index;
			this.node = ROCK.DOM.createNode("div");

			ROCK.DOM.addClass(this.node, "tile");
			ROCK.DOM.addClass(this.node, this.black?"black":"white");
			this.setState(this.state);

			this.node.addEventListener("click", function() {

				if(!tile.black) {
					return;
				};

				var
				empty = tile.isEmpty();

				if(empty&&tile.board.selected) {

					// is being dropped onto

					var
					legal = false,
					dropping = tile.board.selected,
					indexDiff = (tile.index-dropping.index),
					adjacent;

					if(isAnyOf(indexDiff, dropping.getDirections())) {

						legal = true;

					}
					else if(isAnyOf(indexDiff, dropping.getJumpDirections())) {

						adjacent = dropping.getAdjacent(indexDiff);

						if(!adjacent.isEmpty()&&adjacent.isApponentOf(dropping)) {

							legal = true;

						};

					};

					if(legal) {

						tile.setState(dropping.state);
						dropping.setState(0);

						if(tile.state===3&&tile.row===0) {

							// to be white king

							tile.setState(4);

						}
						else if(tile.state===1&&tile.row===7) {

							// to be red king

							tile.setState(2);

						};

						if(adjacent) {

							adjacent.setState(0);

						};

						console.log([dropping.id, tile.id].join(" "));

						tile.board.selected = null;

					}
					else {

						// non-legal move

					};

				}
				else if(!empty) {

					// is being selected

					tile.board.selected = tile;

				};

			});

		},
		getDirections: function() {

			var
			directions = [9, 7];

			if(this.state===3) {
				
				directions = [-9, -7];

			};

			if(this.isKing()) {
				
				directions = [9, 7, -9, -7];

			};

			return directions;

		},
		getJumpDirections: function() {

			var
			directions = [18, 14];

			if(this.state===3) {
				
				directions = [-18, -14];

			};

			if(this.isKing()) {
				
				directions = [18, 14, -18, -14];

			};

			return directions;

		},
		getPlayer: function() {

			var
			player;

			if(this.state===1||this.state===2) {
				
				player = "red";

			};

			if(this.state===3||this.state===4) {
				
				player = "white";

			};

			return player;

		},
		getAdjacent: function(indexDiff) {

			var
			index = this.index;

			switch(indexDiff) {
				case -14:
					index -= 7;
				break;
				case 14:
					index += 7;
				break;
				case -18:
					index -= 9;
				break;
				case 18:
					index += 9;
				break;
			};

			return this.board.tiles[index];

		},
		setState: function(state) {

			// 0 = empty
			// 1 = red man
			// 2 = red king
			// 3 = white man
			// 4 = white king

			this.state = state;
			ROCK.DOM.setAttribute(this.node, "state", this.state);

			return this;

		},
		setId: function(id) {

			this.id = id;
			// ROCK.DOM.html(this.node, this.id);

			return this;

		},
		isKing: function() {

			var
			king = false;

			if(this.state===2||this.state===4) {
				
				king = true;

			};

			return king;

		},
		isEmpty: function() {

			var
			empty = false;

			if(this.state===0) {
				
				empty = true;

			};

			return empty;

		},
		isApponentOf: function(tile) {

			var
			apponent = true;

			if(this.getPlayer()===tile.getPlayer()) {
				
				apponent = false;

			};

			return apponent;

		},
		renderTo: function(to) {

			ROCK.DOM.append(this.node, to);
			return this;

		},
		state: 0,
		selected: false,
		id: null
	});

	board = new Board();
	board.render(document.body);

})();