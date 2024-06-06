import cx from "classnames";
import { createSignal, onMount } from "solid-js";

import { debounce } from "../helpers";

export default function SlateParser() {
  const [editor, setEditor] = createSignal(null);
  const [fixed, setFixed] = createSignal(false);
  const [data, setData] = createSignal([]);
  const [error, setError] = createSignal<any>({});
  let jsoneditorEl: any;

  onMount(() => {
    if (typeof window === "undefined") return;
    const editor = new (window as any).JSONEditor(jsoneditorEl, {
      onChange: () => {
        debounce(
          () => {
            const data = editor.get().data;
            if (data) {
              setData(data);
            }
          },
          200,
          "jsoneditor:onChange"
        );
      },
    });
    editor.set({
      data: data(),
    });
    setEditor(editor);
  });

  function fixData() {
    if (fixed()) return;
    if (!data().length) {
      setError({ message: "No data to fix" });
      return;
    }
    setError({});

    const newData = [];

    editor().set({
      data: newData,
    });
    setData(newData);
    setFixed(true);
  }

  function download() {
    if (!data().length) {
      setError({ message: "No data to download" });
      return;
    }
    setError({});
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data(), null, 2)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "fixed_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return (
    <div class="dashboard-fixer grid grid-cols-[2fr_1fr] gap-x-8">
      <div class="dashboard-fixer__content">
        <h2 class="text-2xl mb-2">Dashboard</h2>
        <div class="mb-2">
          <input
            type="file"
            id="input"
            name="input"
            accept="application/json"
            onChange={(event) => {
              const reader = new FileReader();
              reader.onload = (event) => {
                let data: any = [];
                const result = event.target.result;
                if (typeof result == "string") {
                  // @ts-ignore
                  data = JSON.parse(event.target.result) || [];
                }
                editor().set({
                  data,
                });
                setData(data);
                setFixed(false);
              };
              reader.readAsText(event.target.files[0]);
            }}
          />
        </div>
        <div class="mb-2 flex gap-x-4">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            class={cx("bg-white text-black px-10", {
              "opacity-50": !data().length || fixed(),
            })}
            onClick={fixData}
            disabled={!data().length || fixed()}
          >
            Fix
          </button>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            class={cx("bg-white text-black px-10", {
              "opacity-50": !fixed(),
            })}
            onClick={download}
            disabled={!fixed()}
          >
            Download
          </button>
        </div>
        {error().message && <p class="text-red-500">{error().message}</p>}
        {fixed() && <p class="text-green-500">Ready to download</p>}
        <div ref={jsoneditorEl} id="jsoneditor" class="h-[700px]" />
      </div>
    </div>
  );
}
