import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'profileColor',
  standalone: true
})
export class ProfileColorPipe implements PipeTransform {
  private colorPalette: string[] = [
    "#fdfd03", "#499ae9", "#fe8b05", "#4eb72a", "#7bfbf6", "#05a149", "#ffc165", "#fe0312",
    "#0197fd", "#d1ae07", "#d355b4", "#8974dd", "#e55151"
  ];
  private profileColorMap: { [key: number]: string } = {};

  transform(profileId: number | undefined | null, alpha: number = 1): string {
    if (!profileId && profileId !== 0) return alpha === 1 ? '#bbb' : 'rgba(187,187,187,0.2)';
    if (!this.profileColorMap[profileId]) {
      this.profileColorMap[profileId] = this.colorPalette[profileId % this.colorPalette.length];
    }
    const hex = this.profileColorMap[profileId];
    if (alpha === 1) return hex;
    const rgb = hex.replace('#', '').match(/.{1,2}/g)?.map(x => parseInt(x, 16)) || [187, 187, 187];
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
  }
}
