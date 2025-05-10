import { Pipe, PipeTransform } from '@angular/core';
import Utils from "src/app/utils/utils";

@Pipe({
  name: 'transformYoutube',
  standalone: true
})
export class TransformYoutubePipe implements PipeTransform {

  transform(link: string, autoplay: boolean = false): string {
    return link ? Utils.transformYoutubeIntoEmbed(link, autoplay) : '';
  }

}
