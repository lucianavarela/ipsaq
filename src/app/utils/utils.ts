export default class Utils {

    static transformYoutubeIntoEmbed(link: string, autoplay: boolean = false): string {
        let transformedLink = link;
        if (link && link.indexOf('you') > -1) {
            let video_code = link.match(/((?!IPSA)[A-Za-z0-9_-]{11})/g);
            if (video_code?.length) {
                transformedLink = `https://www.youtube.com/embed/${video_code[0]}${autoplay ? '?rel=0&autoplay=1&mute=1': ''}`;
            }
        }
        return transformedLink;
    }

    static getTheDate(day: 'today'|'tomorrow'): string {
        const today = new Date();
        if (day == 'tomorrow') today.setDate(today.getDate() + 1);
        var mm = today.getMonth() + 1;
        var dd = today.getDate();
      
        return [today.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
               ].join('-');
      };

    static removeAccents(value: string): string {
        if (value) {
            let accent = [
                /[\u00C0-\u00C6]/g, /[\u00E0-\u00E6]/g, // A, a
                /[\u00C8-\u00CB]/g, /[\u00E8-\u00EB]/g, // E, e
                /[\u00CC-\u00CF]/g, /[\u00EC-\u00EF]/g, // I, i
                /[\u00D2-\u00D8]/g, /[\u00F2-\u00F8]/g, // O, o
                /[\u00D9-\u00DC]/g, /[\u00F9-\u00FC]/g, // U, u
                /[\u00D1]/g, /[\u00F1]/g, // N, n
                /[\u00C7]/g, /[\u00E7]/g, // C, c
            ],
                noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];
        
            for (var i = 0; i < accent.length; i++) {
                value = value.replace(accent[i], noaccent[i]);
            }
        }

        return value;
    }
}