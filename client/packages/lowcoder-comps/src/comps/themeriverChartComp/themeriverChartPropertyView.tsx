import { CompAction } from "lowcoder-core";
import { ChartCompChildrenType  } from "./themeriverChartConstants";
import {
  hiddenPropertyView,
  Section,
  sectionNames,
} from "lowcoder-sdk";
import { trans } from "i18n/comps";
import { examplesUrl,optionUrl } from "../chartComp/chartConfigs/chartUrls";

export function themeriverChartPropertyView(
  children: ChartCompChildrenType,
  dispatch: (action: CompAction) => void
) {

  const jsonModePropertyView = (
    <>
      <Section name={trans("chart.config")}>
        {children.echartsOption.propertyView({
          label: trans("chart.echartsOptionLabel"),
          styleName: "higher",
          tooltip: (
            <div>
              <a href={optionUrl} target="_blank" rel="noopener noreferrer">
                {trans("chart.echartsOptionTooltip")}
              </a>
              <br />
              <a href={examplesUrl} target="_blank" rel="noopener noreferrer">
                {trans("chart.echartsOptionExamples")}
              </a>
            </div>
          ),
        })}
        {children.echartsTitle.propertyView({ label: trans("themeriverChart.title") })}
        {children.tooltip.propertyView({label: trans("themeriverChart.tooltip")})}
      </Section>
      <Section name={sectionNames.interaction}>
        {children.onEvent.propertyView()}
      </Section>
      <Section name={sectionNames.style}>
         {children.style?.getPropertyView()}
      </Section>
      <Section name={sectionNames.layout}>{hiddenPropertyView(children)}</Section>
    </>
  );
  
  const getChatConfigByMode = (mode: string) => {
    switch(mode) {
      case "json":
        return jsonModePropertyView;
    }
  }
  return getChatConfigByMode(children.mode.getView())
}
