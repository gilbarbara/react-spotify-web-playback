export const playerAlbum = {
  uri: 'spotify:album:7KvKuWUxxNPEU80c4i5AQk',
  name: 'Trouble Man',
  images: [
    {
      url: 'https://i.scdn.co/image/177f29ea8006359bd70784a803a21fea0360ca3e',
      height: 298,
      width: 300,
    },
    {
      url: 'https://i.scdn.co/image/38ff482faf9916ca15ccb3e14b2886a27c0866e3',
      height: 64,
      width: 64,
    },
    {
      url: 'https://i.scdn.co/image/10b3bd8afaf3dfa1f302b8f58e059e9802144052',
      height: 636,
      width: 640,
    },
  ],
};

export const playerArtists = [
  {
    name: 'Marvin Gaye',
    uri: 'spotify:artist:3koiLjNrgRTNbOwViDipeA',
  },
];

export const playerTrack = {
  id: '6KUjwoHktuX3du8laPVfO8',
  uri: 'spotify:track:6KUjwoHktuX3du8laPVfO8',
  type: 'track',
  linked_from_uri: null,
  linked_from: {
    uri: null,
    id: null,
  },
  media_type: 'audio',
  name: 'Main Theme From Trouble Man',
  duration_ms: 151626,
  artists: playerArtists,
  album: playerAlbum,
  is_playable: true,
};

export const playerState = {
  context: {
    uri: 'spotify:album:7KvKuWUxxNPEU80c4i5AQk',
    metadata: {
      context_description: 'Trouble Man',
    },
  },
  bitrate: 256000,
  position: 120000,
  duration: 151626,
  paused: true,
  shuffle: false,
  repeat_mode: 0,
  track_window: {
    current_track: playerTrack,
    next_tracks: [
      {
        ...playerTrack,
        name: 'Next Theme From Trouble Man',
      },
    ],
    previous_tracks: [
      {
        ...playerTrack,
        name: 'Previous Theme From Trouble Man',
      },
    ],
  },
  timestamp: 1556483439737,
  restrictions: {
    disallow_resuming_reasons: ['not_paused'],
    disallow_skipping_prev_reasons: ['no_prev_track'],
  },
  disallows: {
    resuming: true,
    skipping_prev: true,
  },
};

export const playerStatus = {
  device: {
    id: '84944e58544c5d9ebfa1b9aa1f1890fb03c42250',
    is_active: true,
    is_private_session: false,
    is_restricted: false,
    name: 'Spotify Web Player',
    type: 'Computer',
    volume_percent: 100,
  },
  shuffle_state: false,
  repeat_state: 'off',
  timestamp: 1557288761568,
  context: {
    external_urls: {
      spotify: 'https://open.spotify.com/album/7KvKuWUxxNPEU80c4i5AQk',
    },
    href: 'https://api.spotify.com/v1/albums/7KvKuWUxxNPEU80c4i5AQk',
    type: 'album',
    uri: 'spotify:album:7KvKuWUxxNPEU80c4i5AQk',
  },
  progress_ms: 10443,
  item: {
    album: {
      album_type: 'album',
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/3koiLjNrgRTNbOwViDipeA',
          },
          href: 'https://api.spotify.com/v1/artists/3koiLjNrgRTNbOwViDipeA',
          id: '3koiLjNrgRTNbOwViDipeA',
          name: 'Marvin Gaye',
          type: 'artist',
          uri: 'spotify:artist:3koiLjNrgRTNbOwViDipeA',
        },
      ],
      available_markets: [],
      external_urls: {
        spotify: 'https://open.spotify.com/album/7KvKuWUxxNPEU80c4i5AQk',
      },
      href: 'https://api.spotify.com/v1/albums/7KvKuWUxxNPEU80c4i5AQk',
      id: '7KvKuWUxxNPEU80c4i5AQk',
      images: [
        {
          height: 636,
          url: 'https://i.scdn.co/image/10b3bd8afaf3dfa1f302b8f58e059e9802144052',
          width: 640,
        },
        {
          height: 298,
          url: 'https://i.scdn.co/image/177f29ea8006359bd70784a803a21fea0360ca3e',
          width: 300,
        },
        {
          height: 64,
          url: 'https://i.scdn.co/image/38ff482faf9916ca15ccb3e14b2886a27c0866e3',
          width: 64,
        },
      ],
      name: 'Trouble Man',
      release_date: '1972-12-08',
      release_date_precision: 'day',
      total_tracks: 13,
      type: 'album',
      uri: 'spotify:album:7KvKuWUxxNPEU80c4i5AQk',
    },
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/3koiLjNrgRTNbOwViDipeA',
        },
        href: 'https://api.spotify.com/v1/artists/3koiLjNrgRTNbOwViDipeA',
        id: '3koiLjNrgRTNbOwViDipeA',
        name: 'Marvin Gaye',
        type: 'artist',
        uri: 'spotify:artist:3koiLjNrgRTNbOwViDipeA',
      },
    ],
    available_markets: [],
    disc_number: 1,
    duration_ms: 151626,
    explicit: false,
    external_ids: {
      isrc: 'USMO17200009',
    },
    external_urls: {
      spotify: 'https://open.spotify.com/track/6KUjwoHktuX3du8laPVfO8',
    },
    href: 'https://api.spotify.com/v1/tracks/6KUjwoHktuX3du8laPVfO8',
    id: '6KUjwoHktuX3du8laPVfO8',
    is_local: false,
    name: 'Main Theme From Trouble Man - 2',
    popularity: 27,
    preview_url:
      'https://p.scdn.co/mp3-preview/ec9f4fcea45b0665dd162b69004271fe55174566?cid=adaaf209fb064dfab873a71817029e0d',
    track_number: 1,
    type: 'track',
    uri: 'spotify:track:6KUjwoHktuX3du8laPVfO8',
  },
  currently_playing_type: 'track',
  actions: {
    disallows: {
      resuming: true,
      skipping_prev: true,
    },
  },
  is_playing: true,
};

export const player = {};
