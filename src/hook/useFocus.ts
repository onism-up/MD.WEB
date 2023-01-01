import { ref } from "vue";
import { parsingIndex } from "@/tools/elm";

export default (indexKey: string) => {
  const onMove = ref(-1);
  const onDown = ref(-1);
  const onMoveEvent = (event: MouseEvent) => {
    onMove.value = parsingIndex(event, indexKey);
  };
  const onDownEvent = (event: MouseEvent) => {
    onDown.value = parsingIndex(event, indexKey);
    event.stopPropagation();
  };

  const onLeaveEvent = () => {
    onMove.value = -1;
    onUpEvent();
  };
  const onUpEvent = () => {
    onDown.value = -1;
  };
  return { onDown, onMove, onMoveEvent, onDownEvent, onLeaveEvent, onUpEvent };
};
