export default class Utils {

    static transformYoutubeIntoEmbed(link: string): string {
        let transformedLink = link;
        if (link && link.indexOf('youtube') > -1) {
            transformedLink = link.replace('watch?v=', 'embed/')
        }
        return transformedLink;
    }

}