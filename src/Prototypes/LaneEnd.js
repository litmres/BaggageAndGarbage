"use strict"
const LaneEndTypes = {
    Safe: 0,
    Dangerous: 1
};

const LANE_ICON_SPRITE_KEY_SAFE = "img_LaneIcon_Safe"
const LANE_ICON_SPRITE_KEY_DANGER = "img_LaneIcon_Danger"

const LANE_ICON_SCALE_FACTOR = 0.6;
const LANE_ICON_Y_OFFSET = -30;

const LANE_END_LENGTH = 300;

function LaneEnd(type, onBagKilled, bagList, position) {
    
    this.type = type;
    this.onBagKilled = onBagKilled,
    this.bags = bagList;

    let iconSpriteKey;
    let beltSpriteSheet;
    switch (type) {
        case LaneEndTypes.Safe:
            iconSpriteKey = LANE_ICON_SPRITE_KEY_SAFE;
            beltSpriteSheet = CONVEYOR_BELT_SHEET_SAFE;
            break;
        case LaneEndTypes.Dangerous:
            iconSpriteKey = LANE_ICON_SPRITE_KEY_DANGER;
            beltSpriteSheet = CONVEYOR_BELT_SHEET_DANGER;
            break;
    }
    let icon = new Phaser.Sprite(game, position.x, position.y + LANE_ICON_Y_OFFSET, iconSpriteKey, 0);
    overlayLayer.add(icon);
    icon.anchor.set(0.5, 0);
    icon.scale.set(LANE_ICON_SCALE_FACTOR, LANE_ICON_SCALE_FACTOR);

    new ConveyorBelt(laneLayer, position, new Vector2D(position.x, position.y + LANE_END_LENGTH), 
        CONVEYOR_LANE_SCALE_FACTOR, null, beltSpriteSheet);
}

LaneEnd.prototype = {
    manageBag: function(bag) {
        let isCorrect = undefined;

        switch (bag.type) {
            case BagTypes.A:
            case BagTypes.B_Safe:
                isCorrect = this.type == LaneEndTypes.Safe;
                break;
            case BagTypes.B_Danger:
            case BagTypes.C:
                isCorrect = this.type == LaneEndTypes.Dangerous;
                break;
            default:
                console.error("A bag has type " + bag.type + ". That value doesn't make sense.");
        }

        let bagIndex = null;
        for (let i = 0; i < this.bags.length; i++) {
            if (this.bags[i] == bag) bagIndex = i;
        }
        if (bagIndex == null) console.error("A LaneEnd tried to kill a bag that isn't in the bags list.");
        this.bags.splice(bagIndex, 1);
        
        this.onBagKilled(isCorrect);
    },
}