function GetMediaPrefix(): string {
  return document.querySelector("meta[name='media-url-prefix']").getAttribute('content')
}

export const MediaPrefix = GetMediaPrefix();