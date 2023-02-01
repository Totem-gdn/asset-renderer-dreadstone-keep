'use strict'
const { DNAParser, ContractHandler } = require('totem-dna-parser')
const totemCommonFiles = require('totem-common-files')
const maxValue = 4294967295;


class NFT {
  constructor() {
    this.ApiURL = process.env.API_URL;
    this.ReverseApiURL = process.env.RESERVE_API_URL;

    this.Contracts = {
      avatar: process.env.AVATAR_CONTRACT,
      item: process.env.ITEM_CONTRACT,
      gem: process.env.GEM_CONTRACT
    }
  }
  async get (type, id) {
    try {

      let dna;
      try {
        const contractHandler = new ContractHandler(this.ApiURL, this.Contracts[type]);
        dna = await contractHandler.getDNA(id);
      } catch (error) {
        const contractHandler = new ContractHandler(this.ReverseApiURL, this.Contracts[type]);
        dna = await contractHandler.getDNA(id);
      }
      let parser;
      if (type === 'avatar') {
        parser = new DNAParser(totemCommonFiles.totemAvatarDreadstoneKeepFilterJson, dna);
      } else if (type === 'item') {
        parser = new DNAParser(totemCommonFiles.totemItemDreadstoneKeepFilterJson, dna);
      }
      const properties = parser.getFilterPropertiesList()
      let jsonProp = {...properties};
      let settings = {};
      for (const key in properties) {
        if (Object.hasOwnProperty.call(properties, key)) {
          settings[jsonProp[key]] = parser.getField(properties[key]);
        }
      }

      for (const key in settings) {
        if (Object.hasOwnProperty.call(settings, key) && key === 'range_nd') {
          settings.range_nd = Math.round((settings.range_nd / maxValue) * 100);
          settings['weapon_type'] = settings.range_nd < 50 ? 'Axe' : 'Dagger';
        }
      }
      return type === 'avatar' ? this.generateAvatarJson(settings) : settings;
    } catch (e) {
      console.log(e)
    }
  }


  generateAvatarJson(avatarSetting) {
    avatarSetting['human_skin_color_darken'] = this.adjust(avatarSetting.human_skin_color, -50);
    avatarSetting['human_hair_color_lighten'] = this.adjust(avatarSetting.human_hair_color, 150);
    avatarSetting['human_hair_color_darken'] = this.adjust(avatarSetting.human_hair_color, -50);
    return avatarSetting;
  }

  adjust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }
}

module.exports = new NFT()