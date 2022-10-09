export default class Utils {

    static transformYoutubeIntoEmbed(link: string, autoplay: boolean = false): string {
        let transformedLink = link;
        if (link && link.indexOf('you') > -1) {
            let video_code = link.match(/((?!IPSA)[A-Za-z0-9_-]{11})/g);
            if (video_code?.length != 1) {
                video_code = link.match(/=((?!IPSA)[A-Za-z0-9_-]{11})/g);
                if (video_code?.length != 1) {
                    video_code = link.match(/=((?!IPSA)[A-Za-z0-9_-]{11})/g);
                }
            }
            if (video_code?.length==1) {
                transformedLink = `https://www.youtube.com/embed/${video_code[0]}${autoplay ? '?rel=0&autoplay=1&mute=1': ''}`;
            }
        }
        return transformedLink;
    }

    static getToday(): string {
        const today = new Date();
        var mm = today.getMonth() + 1;
        var dd = today.getDate();
      
        return [today.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
               ].join('-');
      };
}