function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

const convert = {
      
    rgbToHex(rgb) {
        return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
    },

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ]
         : null;
    },

    rgbToString(rgb){
        return rgb[0].toString() + "," + rgb[1].toString() + "," + rgb[2].toString();
    },

    hexToRgbString(hex){
        var rgb = this.hexToRgb(hex);
        if (rgb === null || rgb.length !== 3)
            return null;
        return rgb[0]+","+rgb[1]+","+rgb[2];
    }

}

export default convert;