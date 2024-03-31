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
                /[\300-\306]/g, /[\340-\346]/g, // A, a
                /[\310-\313]/g, /[\350-\353]/g, // E, e
                /[\314-\317]/g, /[\354-\357]/g, // I, i
                /[\322-\330]/g, /[\362-\370]/g, // O, o
                /[\331-\334]/g, /[\371-\374]/g, // U, u
                /[\321]/g, /[\361]/g, // N, n
                /[\307]/g, /[\347]/g, // C, c
            ],
                noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];
        
            for (var i = 0; i < accent.length; i++) {
                value = value.replace(accent[i], noaccent[i]);
            }
        }

        return value;
    }
}