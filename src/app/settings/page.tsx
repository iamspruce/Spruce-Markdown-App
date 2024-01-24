"use client";
import { usePreferences } from "@/context/AppPreferenceProvider";
import React from "react";
const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

const Home = () => {
  const { preferences, updatePreferences } = usePreferences();

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const newValue =
      type === "checkbox" ? (event.target as HTMLInputElement).checked : value;

    updatePreferences(name, newValue);
    electronAPI.updateParentWindow({ name: name, value: newValue });
  };

  const onEnterApiKey = async () => {
    await electronAPI.openAPIKeyModal();
  };
  const onEnterLicensekey = async () => {
    await electronAPI.openLicenseModal();
  };

  return (
    <div className="settings">
      <section className="section">
        <label className="section_label" htmlFor="theme">
          Choose theme:
          <div>
            <select
              name="theme"
              id="theme"
              onChange={handleChange}
              value={preferences?.theme}
            >
              <option value="tomorrow">Tomorrow</option>
              <option value="solorizedDark">Solorized Dark</option>
              <option value="solorizedLight">Solorized Light</option>
              <option value="writer">Writer</option>
            </select>
          </div>
        </label>
        <label className="section_label" htmlFor="fontStyle">
          Base Font:
          <div>
            <select
              name="fontStyle"
              id="fontStyle"
              onChange={handleChange}
              value={preferences?.fontStyle}
            >
              <option value="Roboto">Roboto</option>
              <option value="Lato">Lato</option>
              <option value="OpenSans">Open Sans</option>
              <option value="Merriweather">Merriweather</option>
              <option value="FiraCode">Fira Code</option>
              <option value="Menlo">Menlo Regular</option>
            </select>
          </div>
        </label>
        <label className="section_label" htmlFor="fontSize">
          Text size:
          <div>
            <input
              className="section_label_textFiel"
              type="text"
              name="fontSize"
              id="fontSize"
              value={preferences?.fontSize}
              onChange={handleChange}
            />
          </div>
        </label>
        <label className="section_label" htmlFor="ifStream">
          <p></p>
          <div className="flex_item">
            <input
              onChange={handleChange}
              checked={preferences?.ifStream}
              type="checkbox"
              name="ifStream"
              id="ifStream"
            />
            <div className="">
              <strong>Stream AI Response(typing animation)</strong>
              <p>
                When this is enabled response from AI are typed into the editor
                word by word
              </p>
            </div>
          </div>
        </label>
        <label className="section_label" htmlFor="ifRemDoc">
          <p></p>
          <div className="flex_item">
            <input
              onChange={handleChange}
              checked={preferences?.ifRemDoc}
              type="checkbox"
              name="ifRemDoc"
              id="ifRemDoc"
            />
            <div>
              <strong>Reopen Previous Document</strong>
              <p>
                When this is enabled your last document will be opened in the
                editor
              </p>
            </div>
          </div>
        </label>
        <label className="section_label" htmlFor="ifSpellCheck">
          <p></p>
          <div className="flex_item">
            <input
              onChange={handleChange}
              checked={preferences?.ifSpellCheck}
              type="checkbox"
              name="ifSpellCheck"
              id="ifSpellCheck"
            />
            <div>
              <strong>Spell Check(coming soon)</strong>
              <p>Enable this to use spell checking in your document</p>
            </div>
          </div>
        </label>
        <label className="section_label" htmlFor="ifCodeHighlight">
          <p></p>
          <div className="flex_item">
            <input
              onChange={handleChange}
              checked={preferences?.ifCodeHighlight}
              type="checkbox"
              name="ifCodeHighlight"
              id="ifCodeHighlight"
            />
            <div>
              <strong>Syntex Highlight Code</strong>
              <p>Enable this to display word count in your document</p>
            </div>
          </div>
        </label>
        <label className="section_label" htmlFor="ifWordCount">
          <p></p>
          <div className="flex_item">
            <input
              onChange={handleChange}
              checked={preferences?.ifWordCount}
              type="checkbox"
              name="ifWordCount"
              id="ifWordCount"
            />
            <div>
              <strong>World Count</strong>
              <p>Enable this to display word count in your document</p>
            </div>
          </div>
        </label>
      </section>
      <section className="section">
        <label className="section_label" htmlFor="ApiKey">
          Enter API key:
          <div>
            <input
              className="section_label_btn"
              id="ApiKey"
              type="button"
              value="Set API Key"
              onClick={onEnterApiKey}
            />
          </div>
        </label>
        <label className="section_label" htmlFor="license">
          Enter License Key:
          <div>
            <input
              className="section_label_btn"
              id="license"
              type="button"
              value="Set License Key"
              onClick={onEnterLicensekey}
            />
          </div>
        </label>
      </section>
    </div>
  );
};

export default Home;
