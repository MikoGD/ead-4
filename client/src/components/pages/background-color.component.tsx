import React, { MutableRefObject, ReactElement } from 'react';
import { ColorCookie } from '../../cookies';
import ColorEditor, {
  HandleSubmitCallback,
  Inputs,
} from '../color-editor/color-editor.component';

function BackgroundPage(): ReactElement {
  async function handleSubmit(
    handleSubmitCallback: (cb: HandleSubmitCallback) => void,
    cookieObj: MutableRefObject<ColorCookie>
  ) {
    handleSubmitCallback((colorInputs: Inputs) => {
      cookieObj.current.backgroundColorIndex = colorInputs.colorId;
      document.body.style.backgroundColor = colorInputs.hexString;
    });
  }

  return (
    <ColorEditor
      handleSubmit={handleSubmit}
      isSubmitSuccess={null}
      submitButtonText="Set Background Color"
      submitSuccessText=""
      submitFailedText=""
      isSearchEditor
    />
  );
}

export default BackgroundPage;
