interface ScopusSearchResponse {
  'search-results': {
    entry: Array<{
      'dc:title'?: string;
      'prism:doi'?: string;
      'prism:publicationName'?: string;
      [key: string]: any;
    }>
  }
}