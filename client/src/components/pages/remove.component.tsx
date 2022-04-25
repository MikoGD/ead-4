import React, { ReactElement, useState } from 'react';
import { removeColor } from '../../api/axios';
import ColorEditor, {
  HandleSubmitCallback,
  Inputs,
} from '../color-editor/color-editor.component';

function RemovePage(): ReactElement {
  const [didColorDelete, setDidColorDelete] = useState<boolean | null>(null);

  async function handleSubmit(
    handleSubmitCallback: (cb: HandleSubmitCallback) => void
  ) {
    handleSubmitCallback(async (colorInputs: Inputs) => {
      const { colorId } = colorInputs;

      try {
        await removeColor(colorId);
        setDidColorDelete(true);
      } catch (e) {
        setDidColorDelete(false);
      } finally {
        setTimeout(() => {
          setDidColorDelete(null);
        }, 5000);
      }
    });
  }

  return (
    <>
      <div className="bg-white mx-auto w-25 p-1 my-2 d-flex justify-content-center align-items-center">
        <h2>Remove color</h2>
      </div>
      <ColorEditor
        handleSubmit={handleSubmit}
        isSubmitSuccess={didColorDelete}
        submitButtonText="Remove Color"
        submitSuccessText={({ colorId }: Inputs) => `Deleted color: ${colorId}`}
        submitFailedText="Failed to delete color"
        isSearchEditor
      />
    </>
  );
}

export default RemovePage;
