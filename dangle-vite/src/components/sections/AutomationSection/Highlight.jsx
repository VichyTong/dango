import React, { useState, useEffect, useCallback } from "react";
import { DangoState, useDangoStateStore } from "@/stores/dangoStateStore";

export default function HighlightedText({ text, condition, isEdit, onUpdate }) {
  const [editedText, setEditedText] = useState(text);
  const [internalCondition, setInternalCondition] = useState(condition);

  const setCurState = useDangoStateStore((state) => state.setCurState);

  const combineTextAndCondition = useCallback((text, condition) => {
    const conditionText = condition ? ` ${condition}` : "";
    return `${text}${conditionText}`.trim();
  }, []);

  useEffect(() => {
    const newCombinedText = combineTextAndCondition(text, condition);
    setEditedText(newCombinedText);
    setInternalCondition(condition);
  }, [text, condition, combineTextAndCondition]);

  const handleChange = (e) => {
    setEditedText(e.target.value);
    setCurState(DangoState.EDIT_DSL);
  };

  const handleBlur = () => {
    // Keep the original text and condition separate
    onUpdate(editedText);
  };

  if (isEdit) {
    return (
      <textarea
        value={editedText}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full p-1"
        rows={3}
      />
    );
  }

  return <span>{editedText}</span>;
}
