import { UUID } from 'crypto';

// ************************** 쿠키

export type Cookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

type CookieOptions = {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

// ************************** 회원가입 / 로그인
export interface SignInForm {
  useremail: string;
  password: string;
}

export interface SignUpForm extends SignInForm {
  nickname: string;
}

export type UserInfo = {
  nickname: string;
  useremail: string;
  birthDay: string | null;
  phone: string | null;
  thumbnail: Image | null;
  // userCalendarId: UserCalendarListInfo;
  // kakaoId?: number;    //TODO setting 객체로 받을 듯?
  // kakaoRefresh?: number;
};

// ************************** 캘린더

export type Image = string;

export interface ImageFile {
  name?: string | UUID;
  file?: File;
  imageSrc?: Image; // DB에서 전달받는 src
  src: Image;
}

export type CalendarId = UUID | 'All';

export type UserCalendarListInfo = {
  userCalendarId: UUID;
  // groupCalendar: GroupEvent[] | null;
  // socialEvents: SocialEvent[] | null;
};

export type CreateCalendarForm = {
  title: string;
  type: string; //TODO color로 변경?
};

export type Calendar = {
  calendarId: UUID;
  title: string;
  coverImage: ImageFile | null;
  bannerImage?: ImageFile;
  type: string; // Color
  attendees: Member[]; // 객체
};

// ************************** 이벤트 (일정)

export interface Author {
  useremail: string;
  thumbnail: Image | null;
  nickname: string;
}

export type Member = Author;

// export interface reqGroupEvent {
//   groupCalendarId?: CalendarId;
//   title: string;
//   color: string | null;
//   reqMember?: string[] | null;
//   startAt: string;
//   endAt: string;
// }

// export interface GroupEvent extends reqGroupEvent {
//   groupCalendarTitle?: string;
//   groupEventId?: UUID;
//   memberObj?: Member[] | null;
//   member: string[];
//   author?: Author; //TODO 받을 땐 email일걸 ?
//   pinned: boolean;
//   alerts?: number;
//   attachment?: string;
// }

// export type SocialEvent = {
//   userCalendarId?: string;
//   socialEventId: UUID;
//   title?: string;
//   startAt: string;
//   endAt: string;
//   isPast: boolean;
//   social: string;
// };

export interface DefaultEvent {
  //* 그룹 멤버들 일정 + create 할 때
  groupCalendarId?: UUID;
  title: string;
  startAt: string;
  endAt: string;
}

export interface AllEvent extends DefaultEvent {
  id: UUID;
  type?: string; // 그룹 캘린더에 지정된 색
  group?: string;
  social?: 'kakao'; //TODO 'kakao' | 'google' | 'outlook'
}

export interface GroupEvent extends DefaultEvent {
  groupEventId: UUID;
  member: string[];
  color: string;
  pinned: boolean;
  alerts: number | null;
  groupCalendarTitle?: string;
  author?: string;
  createdAt?: string;
  reqMember?: Member[];
}

// ************************** 피드

export interface reqEventFeed {
  groupEventId?: UUID | null;
  feedType: number | string;
  title: 'Title';
  content: string;
  images: ImageFile[];
}

export interface EventFeed extends reqEventFeed {
  thumbnail?: Image | null;
  feedId: UUID;
  nickname: string;
  createdAt: string;
}

// ************************** 댓글

export interface reqComment {
  feedId?: UUID;
  content: string;
}

export interface Comment extends reqComment {
  nickname: string;
  thumbnail: Image;
  feedCommentId: UUID;
  createdAt: string;
}

// ************************** 채팅

export type Message = {
  id: UUID; // 소켓 ID -> 나갔다 들어왔다 할 때 마다 바뀜
  nickname: string;
  message: string;
  image?: Image;
};
