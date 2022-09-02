import { Pipe, PipeTransform } from '@angular/core';
import Utils from "src/app/utils/utils";

@Pipe({
  name: 'transformYoutube'
})
export class TransformYoutubePipe implements PipeTransform {

  transform(link: string): string {
    return link ? Utils.transformYoutubeIntoEmbed(link) : '';
  }

}
