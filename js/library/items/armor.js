/**
 * @class Generic shield
 * @augments RPG.Items.BaseItem
 */
RPG.Items.Shield = OZ.Class().extend(RPG.Items.BaseItem);
RPG.Items.Shield.flags.abstr4ct = true;
RPG.Items.Shield.prototype.init = function() {
	this.parent();
	this._char = "[";
	this._color = "darkgray";
}

/**
 * @class Small shield
 * @augments RPG.Items.BaseItem
 */
RPG.Items.SmallShield = OZ.Class().extend(RPG.Items.Shield);
RPG.Items.SmallShield.prototype.init = function() {
	this.parent();
	this._description = "small shield";
	this._image = "small-shield";
	this.addModifier(RPG.FEAT_DV, 2);
}

/**
 * @class Medium shield
 * @augments RPG.Items.BaseItem
 */
RPG.Items.MediumShield = OZ.Class().extend(RPG.Items.Shield);
RPG.Items.MediumShield.prototype.init = function() {
	this.parent();
	this._description = "medium shield";
	this._image = "small-shield";
	this.addModifier(RPG.FEAT_DV, 3);
	this.addModifier(RPG.FEAT_PV, 1);
}

/**
 * @class Large shield
 * @augments RPG.Items.BaseItem
 */
RPG.Items.LargeShield = OZ.Class().extend(RPG.Items.Shield);
RPG.Items.LargeShield.prototype.init = function() {
	this.parent();
	this._description = "large shield";
	this._image = "large-shield";
	this.addModifier(RPG.FEAT_DV, 5);
	this.addModifier(RPG.FEAT_PV, 1);
}

/**
 * @class Head gear
 * @augments RPG.Items.BaseItem
 */
RPG.Items.HeadGear = OZ.Class().extend(RPG.Items.BaseItem);
RPG.Items.HeadGear.flags.abstr4ct = true;
RPG.Items.HeadGear.prototype.init = function() {
	this.parent();
	this._char = "[";
	this._color = "lightgray";
}

/**
 * @class Boots
 * @augments RPG.Items.BaseItem
 */
RPG.Items.Boots = OZ.Class().extend(RPG.Items.BaseItem);
RPG.Items.Boots.flags.abstr4ct = true;
RPG.Items.Boots.prototype.init = function() {
	this.parent();
	this._char = "[";
	this._color = "brown";
}

/**
 * @class Metal cap
 * @augments RPG.Items.HeadGear
 */
RPG.Items.MetalCap = OZ.Class().extend(RPG.Items.HeadGear);
RPG.Items.MetalCap.prototype.init = function() {
	this.parent();
	this._description = "metal cap";
	this._image = "metal-cap";
	this.addModifier(RPG.FEAT_PV, 1);
}


/**
 * @class Leather boots
 * @augments RPG.Items.Boots
 */
RPG.Items.LeatherBoots = OZ.Class().extend(RPG.Items.Boots);
RPG.Items.LeatherBoots.prototype.init = function() {
	this.parent();
	this._description = "leather boots";
	this._descriptionPlural = "pairs of leather boots";
	this._image = "leather-boots";
	this.addModifier(RPG.FEAT_DV, 1);
}