import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import App from "./App.vue";

describe("App.vue", () => {
  it("renders brand avatar and default navigation heading", () => {
    const wrapper = mount(App);
    const avatar = wrapper.find("img[src='/avatar.jpg']");
    expect(avatar.exists()).toBe(true);
    expect(wrapper.text()).toContain("Aliezzar Wijaya");
    expect(wrapper.text()).toContain("Fokus membangun arsitektur Backend tangguh");
  });
});
