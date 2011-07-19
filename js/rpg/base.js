/**
 * @class Basic race
 * @augments RPG.Visual.IVisual
 */
RPG.Races.BaseRace = OZ.Class().implement(RPG.Visual.IVisual);
RPG.Races.BaseRace.prototype.init = function() {
	this._slots = {};
	this._defaults = [];
	for (var i=0;i<RPG.Feats.length;i++) { this._defaults.push(RPG.Feats[i].getAverage()); }
}

RPG.Races.BaseRace.prototype.getDefaults = function() {
	return this._defaults;
}

RPG.Races.BaseRace.prototype.getSlots = function() {
	return this._slots;
}

/**
 * @class Basic per-turn effect: represents a condition for a being.
 * Effects have various qualities:
 *  - they may hold modifiers,
 *  - they are eneterable,
 *  - they may have a limited duration,
 *  - additionally, they can perform anything during being's turn
 * @augments RPG.Misc.IEnterable
 */
RPG.Effects.BaseEffect = OZ.Class().implement(RPG.Misc.IEnterable);
RPG.Effects.BaseEffect.prototype.init = function(turnsRemaining) {
	this._modifiers = {};
	this._being = null;
	this._turnsRemaining = turnsRemaining || 0;
}

RPG.Effects.BaseEffect.prototype.go = function() {
	if (this._turnsRemaining) {
		this._turnsRemaining--;
		if (!this._turnsRemaining) { this._being.removeEffect(this); }
	}
}

RPG.Effects.BaseEffect.prototype.entering = function(being) {
	this._being = being;
	return this.parent(being);
}

/**
 * @class Body part - place for an item
 */
RPG.Slots.BaseSlot = OZ.Class();
RPG.Slots.BaseSlot.prototype.init = function(name, allowed) {
	this._item = null;
	this._being = null;
	this._name = name;
	this._allowed = allowed;
}

RPG.Slots.BaseSlot.prototype.setBeing = function(being) {
	this._being = being;
	return this;
}

RPG.Slots.BaseSlot.prototype.filterAllowed = function(itemList) {
	var arr = [];
	for (var i=0;i<itemList.length;i++) {
		var item = itemList[i];
		if (item instanceof this._allowed && !item.isUnpaid()) { arr.push(item); }
	}
	return arr;
}

RPG.Slots.BaseSlot.prototype.setItem = function(item) {
	var it = item;
	
	if (it) {
		if (it.getAmount() == 1) {
			if (this._being.hasItem(it)) { this._being.removeItem(it); }
		} else {
			it = it.subtract(1);
		}
	}
	
	this._item = it;
	return it;
}

RPG.Slots.BaseSlot.prototype.getItem = function() {
	return this._item;
}

RPG.Slots.BaseSlot.prototype.getName = function() {
	return this._name;
}

/**
 * @class Base profession
 * @augments RPG.Visual.IVisual
 */
RPG.Professions.BaseProfession = OZ.Class().implement(RPG.Visual.IVisual);
RPG.Professions.BaseProfession.prototype.setup = function(being) {
	var tmp = new RPG.Items.HealingPotion();
	being.addItem(tmp);

	var tmp = new RPG.Items.IronRation();
	being.addItem(tmp);
}

/**
 * @class Quest
 */
RPG.Quests.BaseQuest = OZ.Class();
RPG.Quests.BaseQuest.prototype.init = function(giver) {
	this._phase = null;
	this._giver = giver;
	this._task = null; /* textual description */
	
	this.setPhase(RPG.QUEST_NEW);
}

RPG.Quests.BaseQuest.prototype.setPhase = function(phase) {
	this._phase = phase;
	
	switch (phase) {
		case RPG.QUEST_GIVEN:
			RPG.Game.pc.addQuest(this);
		break;
		case RPG.QUEST_DONE:
			RPG.UI.buffer.important("You have just completed a quest.");
		break;
		case RPG.QUEST_REWARDED:
			RPG.Game.pc.removeQuest(this);
			this.reward();
		break;
	}
	
	return this;
}
RPG.Quests.BaseQuest.prototype.getPhase = function() {
	return this._phase;
}
RPG.Quests.BaseQuest.prototype.getGiver = function() {
	return this._giver;
}
RPG.Quests.BaseQuest.prototype.getTask = function() {
	return this._task;
}
RPG.Quests.BaseQuest.prototype.setTask = function(task) {
	this._task = task;
	return this;
}
RPG.Quests.BaseQuest.prototype.reward = function() {
}

