import React, { ReactElement, useState } from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { updateColor } from '../../api/axios';
import { Color } from '../../types';
import ColorEditor, {
  HandleSubmitCallback,
  Inputs,
} from '../color-editor/color-editor.component';

function UpdatePage(): ReactElement {
  const [didUpdateSucceed, setDidUpdateSucceed] = useState<boolean | null>(
    null
  );

  async function handleSubmit(
    handleSubmitCallback: (cb: HandleSubmitCallback) => void
  ) {
    handleSubmitCallback(async (colorInputs: Inputs) => {
      const newColor: Color = {
        name: colorInputs.name,
        colorId: colorInputs.colorId,
        hexString: colorInputs.hexString,
        rgb: {
          r: colorInputs.r,
          g: colorInputs.g,
          b: colorInputs.b,
        },
        hsl: {
          h: colorInputs.h,
          s: colorInputs.s,
          l: colorInputs.l,
        },
      };

      try {
        await updateColor(newColor);
        setDidUpdateSucceed(true);
      } catch (e) {
        setDidUpdateSucceed(false);
      } finally {
        setTimeout(() => {
          setDidUpdateSucceed(null);
        }, 5000);
      }
    });
  }

  return (
    <ColorEditor
      handleSubmit={handleSubmit}
      isSubmitSuccess={didUpdateSucceed}
      submitButtonText="Update color"
      submitSuccessText={(colorInputs: Inputs) =>
        `Updated color: ${colorInputs.colorId}`
      }
      submitFailedText={(colorInputs: Inputs) =>
        `Failed to update color: ${colorInputs.colorId}`
      }
    />
  );
}

export default UpdatePage;
