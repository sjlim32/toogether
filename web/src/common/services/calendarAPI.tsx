import { AxiosError } from 'axios';
import { UUID } from 'crypto';
import { format } from 'date-fns';

import * as API from '@utils/api';

import {
  GroupEvent,
  Calendar,
  CreateCalendarForm,
  DefaultEvent,
  MemberWithEvent,
  GroupingMemberEvent,
} from '@type/index';
import {
  useCalendarListStore,
  useGroupEventInfoStore,
  useGroupEventListStore,
  useMemberEventListState,
  useSelectedCalendarStore,
  useUserInfoStore,
} from '@store/index';

export async function getMyAllCalendar() {
  if (useCalendarListStore.getState().isLoaded) return;

  try {
    const { data: res } = await API.get(`/calendar/get_calendar/v2`);
    if (!res) throw new Error('CALENDAR - getAllCalendar (db 조회 실패)');

    console.log('CALENDAR - getAllCalendar 성공 :', res); //debug//

    useCalendarListStore.getState().setCalendarList(res);

    res.forEach((data: Calendar, idx: number) => {
      sessionStorage.setItem(`${data.title} - ${idx}`, data.calendarId);
    });

    useCalendarListStore.getState().setIsLoaded(true);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - getAllCalendar 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function createGroupCalendar({ title, type }: CreateCalendarForm) {
  try {
    const res = await API.post(`/calendar/create`, {
      title,
      type,
    });
    if (!res) throw new Error('CALENDAR - createGroupCalendar (DB 캘린더 생성 실패)');
    console.log(`CALENDAR - createGroupCalendar 성공 :`, res);

    useCalendarListStore.getState().setIsLoaded(false);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - createGroupCalendar 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function removeGroupCalendar(groupCalendar: Calendar | 'All') {
  if (groupCalendar === 'All') return alert('캘린더 목록에서 캘린더를 선택해주세요.');
  try {
    const res = await API.patch(`/calendar/remove/${groupCalendar.calendarId}`);
    console.log(`CALENDAR - removeGroupCalendar 성공 :`, res);

    useCalendarListStore.getState().setIsLoaded(false);
    useSelectedCalendarStore.getState().setSelectedCalendar('All');

    alert('그룹 캘린더가 삭제되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - removeGroupCalendar 실패 :`, data); //debug//
      alert('일정 삭제에 실패했습니다.');
    }
  }
}

export async function getMemberAndMemberEvents(calendarId: UUID) {
  if (!calendarId)
    return console.log(`CALENDAR - getMemberAndMemberEvents (캘린더 id 없음) : { ${calendarId} }`);

  try {
    const { data: res } = await API.get(`/auth/all/getcalendar/v2/${calendarId}`);
    if (!res) throw new Error('CALENDAR - getMemberAndMemberEvents (db 조회 실패)');
    console.log(`CALENDAR - getMemberAndMemberEvents 성공 :`, res);

    const MemberEventList = res.map((member: MemberWithEvent) => {
      const GroupedEvents: GroupingMemberEvent = {};
      member.allevents?.forEach((event) => {
        const formattedStartAt = format(new Date(event.startAt), 'yyyy-MM-dd');
        if (!GroupedEvents[formattedStartAt]) {
          GroupedEvents[formattedStartAt] = [];
        }
        GroupedEvents[formattedStartAt].push(event);
      });

      return {
        useremail: member.useremail,
        nickname: member.nickname,
        groupedEvent: GroupedEvents,
      };
    });

    useMemberEventListState.getState().setAllEventList(MemberEventList);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - getMemberAndMemberEvents 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function getGroupAllEvents(calendar: Calendar) {
  if (!calendar) return console.log(`CALENDAR - getGroupAllEvents (캘린더 id 없음) :`, calendar);

  try {
    const { data: res } = await API.get(`/calendar/group/get/all/v2/${calendar.calendarId}`);
    if (!res) throw new Error('CALENDAR - getGroupAllEvents (db 조회 실패)');
    console.log(`CALENDAR - getGroupAllEvents 성공 :`, res);

    useGroupEventListStore.getState().setGroupEvents(res.groupCalendar.events);

    const currentState = useSelectedCalendarStore.getState();
    if (currentState.selectedCalendar === 'All') return;

    return res.groupCalendar;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - getGroupAllEvents 실패 :`, data); //debug//
      alert(data.message);
    }
  }
}

export async function getGroupOneEvent(groupEventId: UUID) {
  try {
    const { data: res } = await API.get(`/calendar/group/get/detail/${groupEventId}`);
    if (!res) throw new Error('CALENDAR - getGroupOneEvent (db 조회 실패)');
    console.log(`CALENDAR - getGroupOneEvent 성공 :`, res);

    useGroupEventInfoStore.getState().setGroupEventInfo(res);

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - getGroupOneEvent 실패 :`, data); //debug//
      alert('일정을 가져오지 못했습니다.');
    }
  }
}

export async function createGroupEvent({ groupCalendarId, title, startAt, endAt }: DefaultEvent) {
  try {
    const { data: res } = await API.post(`/calendar/group/create/${groupCalendarId}`, {
      title,
      startAt,
      endAt,
      member: [useUserInfoStore.getState().userInfo?.useremail],
      color: '#badfff',
    });
    if (!res) throw new Error('CALENDAR - createGroupEvent (DB 이벤트 생성 실패)');
    console.log(`CALENDAR - createGroupEvent 성공 :`, res);
    alert('일정을 등록했습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - createGroupEvent 실패 :`, data); //debug//
      alert('일정 등록에 실패했습니다.');
    }
  }
}

export async function updateGroupEvent({
  title,
  startAt,
  endAt,
  member,
  color,
  pinned,
  groupEventId,
  alerts,
}: GroupEvent) {
  try {
    const { data: res } = await API.patch(`/calendar/group/update/${groupEventId}`, {
      title,
      startAt,
      endAt,
      member,
      color,
      pinned,
      alerts,
    });
    if (!res) throw new Error(`CALENDAR - updateGroupEvent (DB 수정 반영 실패)`);
    console.log(`CALENDAR - updateGroupEvent 성공 :`, res);
    useGroupEventInfoStore.getState().setGroupEventInfo(res);
    alert('일정이 수정되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - updateGroupEvent 실패 :`, data); //debug//
      alert('일정 수정에 실패했습니다.');
    }
  }
}

export async function removeGroupEvent(groupEventId: UUID | null) {
  if (!groupEventId) return alert('삭제할 일정을 선택해주세요.');

  try {
    const res = await API.patch(`/calendar/group/remove/${groupEventId}`);
    console.log(`CALENDAR - removeGroupEvent 성공 :`, res);

    alert('일정이 삭제되었습니다.');

    return true;
  } catch (e) {
    const err = e as AxiosError;

    if (err.response) {
      const data = err.response.data as API.ErrorResponse;
      console.error(`CALENDAR - removeGroupEvent 실패 :`, data); //debug//
      alert('일정 삭제에 실패했습니다.');
    }
  }
}

// const MemberEventList: MemberEvent[] = [];
// const userInfo = useUserInfoStore.getState().userInfo;

// res.forEach((member: MemberWithEvent) => {
//   if (userInfo && member.useremail !== userInfo.useremail) {
//     member.allevents.forEach((event) => {
//       const existingEvent = MemberEventList.find(
//         (e) =>
//           e.title === event.title && e.startAt === event.startAt && e.endAt === event.endAt,
//       );

//       if (existingEvent) {
//         if (!existingEvent.useremail.includes(member.useremail)) {
//           existingEvent.useremail.push(member.useremail);
//         }
//         if (!existingEvent.nickname.includes(member.nickname)) {
//           existingEvent.nickname.push(member.nickname);
//         }
//       } else {
//         MemberEventList.push({
//           title: event.title,
//           startAt: event.startAt,
//           endAt: event.endAt,
//           useremail: [member.useremail],
//           nickname: [member.nickname],
//         });
//       }
//     });
//   }
// });

// useMemberEventListState.getState().setAllEventList(MemberEventList);
