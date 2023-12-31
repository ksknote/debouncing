import { useSetRecoilState } from "recoil";
import debounceLogState from "../atom";

let timer: NodeJS.Timeout | null = null; //지연 호출을 관리할 타이머 선언

function useDebounce(
  func: Function,
  wait: number = 0,
  immediate: boolean = false
) {
  // 훅 진행 상황 관찰을 위한 로그 기록 핸들러입니다. (과제용 기능)
  const logHandler = useSetRecoilState(debounceLogState);

  const setLogMessage = (newLog: string) => {
    logHandler((prev) => [newLog, ...prev]);
  };

  const debounced = (...args: any[]) => {
    //즉시 실행 옵션 true 일 경우 타이머 취소하고 즉시 실행하여 retrun
    if (immediate) {
      setLogMessage("즉시 실행 옵션 선택");
      cancel();
      setLogMessage("즉시 실행");
      return new Promise((resolve, reject) => {
        try {
          const result = func(...args);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    }

    // 타이머가 있는 상태에서 새로운 함수 호출이 들어올 때마다 타이머 리셋
    if (timer) {
      setLogMessage("기존 타이머 취소");
      cancel();
    }

    // 새로운 타이머 설정 delay밀리초 후에 func함수 호출
    return new Promise((resolve, reject) => {
      setLogMessage(`새로운 타이머 설정 ${wait}ms 남았습니다.`);
      timer = setTimeout(() => {
        try {
          const result = func(...args);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, wait);
    });
  };

  // 타이머 취소
  const cancel = () => {
    if (!timer) {
      setLogMessage("타이머가 없습니다.");
      return;
    }
    clearTimeout(timer);
    timer = null;
    setLogMessage("타이머 취소 완료");
  };

  return { debounced, cancel };
}

export default useDebounce;
