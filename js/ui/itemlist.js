/**
 * @class Itemlist
 */
RPG.UI.Itemlist = OZ.Class();

RPG.UI.Itemlist.prototype._groups = {
	"Weapons": RPG.Items.Weapon,
	"Consumables": RPG.Items.Edible,
	"Gold": RPG.Items.Gold,
	"Gems": RPG.Items.Gem
}

RPG.UI.Itemlist.prototype.init = function(data) {
	this._options = {
		label:"",
		pick: null /* -1/0/1 (-1 == unlimited) */
	}
	
	for (var p in data) {
		if (p == "items") { continue; }
		this._options[p] = data[p];
	}
	
	this._events = [];
	this._index = 0;
	this._pageSize = 15;
	this._page = 0;
	this._dom = {
		container: null,
		table: null,
		prev: null,
		next: null
	}
	
	this._prepare(data.items);
	this._build();
	this._addEvents();
	
	document.body.appendChild(this._dom.container);

	this._update(0);
}

RPG.UI.Itemlist.prototype.close = function() {
	this._events.forEach(OZ.Event.remove);
	this._dom.container.parentNode.removeChild(this._dom.container);
}

RPG.UI.Itemlist.prototype._prepare = function(items) {
	/* sort items by groups */
	var arr = [];
	for (var p in this._groups) {
		for (var i=0;i<items.length;i++) {
			var item = items[i];
			if (item instanceof this._groups[p]) { arr.push(item); }
		}
	}

	/* prepare data structure */
	this._data = [];
	for (var i=0;i<arr.length;i++) {
		var obj = {
			item: arr[i],
			checkbox: OZ.DOM.elm("input", {type:"checkbox", id:"item_"+i}),
			button: OZ.DOM.elm("input", {type:"button"}),
			amount: 0,
			label: OZ.DOM.elm("label", {htmlFor:"item_"+i})
		}
		obj.label.innerHTML = arr[i].describe();
		this._data.push(obj);
	}
}

RPG.UI.Itemlist.prototype._addEvents = function() {
	this._events.push(OZ.Event.add(document, "keypress",this.bind(this._keyPress)));
	
	if (this._options.pick) {
		this._events.push(OZ.Event.add(this._dom.container, "click", this.bind(this._click)))
	}
	
	if (this._options.pick == -1) {
		this._events.push(OZ.Event.add(this._dom.container, "change", this.bind(this._change)));
	}
}

RPG.UI.Itemlist.prototype._click = function(e) {
	var elm = OZ.Event.target(e);
	for (var i=0;i<this._data.length;i++) {
		var obj = this._data[i];
		if (obj.button == elm) { this._toggle(obj); }
	}
}

RPG.UI.Itemlist.prototype._change = function(e) {
	var elm = OZ.Event.target(e);
	for (var i=0;i<this._data.length;i++) {
		var obj = this._data[i];
		if (obj.checkbox == elm) { 
			if (elm.checked) {
				this._toggleOn(obj); 
			} else {
				this._toggleOff(obj);
			}
		}
	}
}

RPG.UI.Itemlist.prototype._position = function() {
	var c = this._dom.container;
	var w = c.offsetWidth;
	var h = c.offsetHeight;
	var win = OZ.DOM.win();
	c.style.left = Math.round((win[0]-w)/2) + "px";
	c.style.top = Math.round((win[1]-h)/2) + "px";
}

RPG.UI.Itemlist.prototype._build = function() {
	this._dom.container = OZ.DOM.elm("div", {"class":"items", position:"absolute"});
	
	if (this._options.label) {
		var h = OZ.DOM.elm("h1");
		h.innerHTML = this._options.label;
		this._dom.container.appendChild(h);
	}
	
	var t = OZ.DOM.elm("table");
	this._dom.container.appendChild(t);
	this._dom.table = t;
	this._buildBottom();
}

RPG.UI.Itemlist.prototype._update = function(page) {
	if (page < 0 || page >= Math.ceil(this._data.length/this._pageSize)) { return; }
	
	this._page = page;
	this._index = this._page * this._pageSize;
	var data = [];
	var max = Math.min(this._index + this._pageSize, this._data.length);
	for (var i=this._index;i<max;i++) { data.push(this._data[i]); }
	
	OZ.DOM.clear(this._dom.table);
	for (var p in this._groups) { this._buildGroup(p, data); }
	
	this._dom.prev.style.display = (page > 0 ? "" : "none");
	this._dom.next.style.display = (max < this._data.length ? "" : "none");
	this._position();
}

RPG.UI.Itemlist.prototype._buildBottom = function() {
	var b = OZ.DOM.elm("input", {type:"button"});
	b.value = "Done (z)";
	this._dom.container.appendChild(b);
	this._events.push(OZ.Event.add(b, "click", this.bind(this._done)));

	var b = OZ.DOM.elm("input", {type:"button"});
	b.value = "Previous page (-)";
	this._dom.container.appendChild(b);
	this._events.push(OZ.Event.add(b, "click", this.bind(function() {this._update(this._page-1);})));
	this._dom.prev = b;

	var b = OZ.DOM.elm("input", {type:"button"});
	b.value = "Next page (+)";
	this._dom.container.appendChild(b);
	this._events.push(OZ.Event.add(b, "click", this.bind(function() {this._update(this._page+1);})));
	this._dom.next = b;
}

RPG.UI.Itemlist.prototype._buildGroup = function(name, data) {
	var arr = [];
	var ctor = this._groups[name];
	for (var i=0;i<data.length;i++) {
		var item = data[i].item;
		if (item instanceof ctor) { arr.push(data[i]); }
	}
	if (!arr.length) { return; }
	
	var th = OZ.DOM.elm("thead");
	var tr = OZ.DOM.elm("tr");
	var td = OZ.DOM.elm("td");
	
	var cs = 1;
	if (this._options.pick == 1) { cs = 2; }
	if (this._options.pick == -1) { cs = 3; }
	td.colSpan = cs;
	td.innerHTML = name;
	OZ.DOM.append([this._dom.table, th], [th, tr], [tr, td]);
	
	var tb = OZ.DOM.elm("tbody");
	this._dom.table.appendChild(tb);
	
	for (var i=0;i<arr.length;i++) {
		var item = this._buildItem(arr[i]);
		tb.appendChild(item);
	}
}

RPG.UI.Itemlist.prototype._buildItem = function(item) {
	var localIndex = this._index - this._pageSize * this._page;
	var tr = OZ.DOM.elm("tr");
	
	if (this._options.pick) {
		var td = OZ.DOM.elm("td");
		tr.appendChild(td);
		
		var btn = item.button;
		var code = "a".charCodeAt(0) + localIndex;
		var label = String.fromCharCode(code);
		btn.value = label;
		td.appendChild(btn);

		if (this._options.pick == -1) {
			var td = OZ.DOM.elm("td");
			tr.appendChild(td);
			
			td.appendChild(item.checkbox);
		}
	}
	
	var td = OZ.DOM.elm("td");
	tr.appendChild(td);
	td.appendChild(item.label);

	this._index++;
	return tr;
}

RPG.UI.Itemlist.prototype._toggle = function(obj) {
	if (obj.checkbox.checked) {
		this._toggleOff(obj);
	} else {
		this._toggleOn(obj);
	}
}

RPG.UI.Itemlist.prototype._toggleOn = function(obj) {
	var amount = 1;
	if (this._options.pick == -1) {
		/* ask for amount */
		var max = obj.item.getAmount();
		var amount = 0;
		if (max > 1) {
			amount = prompt("How many?", obj.item.getAmount());
			if (amount == null || amount < 1 || amount > obj.item.getAmount()) { return; }
		} else { 
			amount = max;
		}
	}
	
	obj.checkbox.checked = true;
	obj.amount = parseInt(amount, 10);
	
	if (this._options.pick == 1) {
		/* only one to pick, finish */
		this._done();
	}
}

RPG.UI.Itemlist.prototype._toggleOff = function(obj) {
	obj.checkbox.checked = false;
	obj.amount = 0;
}

RPG.UI.Itemlist.prototype._done = function() {
	var arr = [];
	for (var i=0;i<this._data.length;i++) {
		var obj = this._data[i];
		if (obj.amount > 0) { arr.push([obj.item, obj.amount]); }
	}
	this.close();
	RPG.UI.setMode(RPG.UI_DONE_ITEMS, false, arr);
}

RPG.UI.Itemlist.prototype._keyPress = function(e) {
	var prevent = false;
	
	var ch = e.charCode;
	if (ch == "z".charCodeAt(0)) {
		this._done();
	} else if (ch == "+".charCodeAt(0)) {
		this._update(this._page+1);
	} else if (ch == "-".charCodeAt(0)) {
		this._update(this._page-1);
	} else {
		var index = ch - "a".charCodeAt(0);
		index += this._page * this._pageSize;
		if (index >= 0 && index < this._data.length) {
			this._toggle(this._data[index]);
		} else {
			prevent = false;
		}
	}

	if (prevent) { OZ.Event.prevent(e); } /* we used this keypress */
}