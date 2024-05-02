import type {Meta, StoryObj} from '@storybook/react';

import LocalFooter from "@components/config-pages/local-footer";
import {ComponentProps} from "react";

type ComponentStoryProps = ComponentProps<typeof LocalFooter> & {}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Config Pages/Local Footer',
  component: LocalFooter,
  tags: ['autodocs'],
  argTypes: {
    suFooterEnabled: {control: "boolean"}
  }
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LocalFooterDisplay: Story = {
  args: {
    suFooterEnabled: true,
    suLocalFootAction: [
      {title: "Action link 1", url: "https://localhost", internal: false},
      {title: "Action link 2", url: "https://localhost", internal: false}
    ],
    suLocalFootFButton: "suLocalFoot_f_button",
    suLocalFootFIntro: {processed: "suLocalFoot_f_intro"},
    suLocalFootFMethod: "suLocalFoot_f_method",
    suLocalFootFUrl: {title: "Form Action url", url: "https://localhost", internal: false},
    suLocalFootLocLink: {title: "suLocalFoot_loc_link", url: "https://localhost", internal: false},
    suLocalFootPrCo: {processed: "First Content Block"},
    suLocalFootPrimary: [
      {title: "Primary link 1", url: "https://localhost", internal: false},
      {title: "Primary link 2", url: "https://localhost", internal: false}
    ],
    suLocalFootPrimeH: "Primary Links Header",
    suLocalFootSeCo: {processed: "Second Content Block"},
    suLocalFootSecond: [
      {title: "Second Link 1", url: "https://localhost", internal: false},
      {title: "Second Link 2", url: "https://localhost", internal: false}
    ],
    suLocalFootSecondH: "Secondary Links Header",
    suLocalFootSocial: [
      {title: "Facebook", url: "https://localhost", internal: false},
      {title: "YouTube", url: "https://localhost", internal: false}
    ],
    suLocalFootTr2Co: {processed: "Third Content Block"},
    suLocalFootTrCo: {processed: "Fourth Content Block"},
    suLocalFootUseLoc: true,
    suLocalFootUseLogo: true,
    suLocalFootLocOp: "suLocalFoot_loc_op",
  },
};
