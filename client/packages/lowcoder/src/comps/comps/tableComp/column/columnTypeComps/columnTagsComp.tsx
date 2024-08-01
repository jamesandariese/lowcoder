import { default as Tag } from "antd/es/tag";
import { PresetStatusColorTypes } from "antd/es/_util/colors";
import { TagsContext } from "components/table/EditableCell";
import {
  ColumnTypeCompBuilder,
  ColumnTypeViewFn,
} from "comps/comps/tableComp/column/columnTypeCompBuilder";
import { ColumnValueTooltip } from "comps/comps/tableComp/column/simpleColumnTypeComps";
import { codeControl, StringControl } from "comps/controls/codeControl";
import { trans } from "i18n";
import styled from "styled-components";
import _ from "lodash";
import { ReactNode, useContext, useState } from "react";
import { toJson } from "really-relaxed-json";
import { hashToNum } from "util/stringUtils";
import { CustomSelect, PackUpIcon } from "lowcoder-design";
import { ScrollBar } from "lowcoder-design";
import { ColoredTagOptionControl } from "comps/controls/optionsControl";
import Tooltip from "antd/es/tooltip";

const colors = PresetStatusColorTypes;

const isStringArray = (value: any) => {
  return (
    _.isArray(value) &&
    value.every((v) => {
      const type = typeof v;
      return type === "string" || type === "number" || type === "boolean";
    })
  );
};

// accept string, number, boolean and array input
const TagsControl = codeControl<Array<string> | string>(
  (value) => {
    if (isStringArray(value)) {
      return value;
    }
    const valueType = typeof value;
    if (valueType === "string") {
      try {
        const result = JSON.parse(toJson(value));
        if (isStringArray(result)) {
          return result;
        }
        return value;
      } catch (e) {
        return value;
      }
    } else if (valueType === "number" || valueType === "boolean") {
      return value;
    }
    throw new TypeError(
      `Type "Array<string> | string" is required, but find value: ${JSON.stringify(value)}`
    );
  },
  { expectedType: "string | Array<string>", codeType: "JSON" }
);

function getTagColor(tagText : any, tagOptions: any[]) {
  const foundOption = tagOptions.find((option: { label: any; }) => option.label === tagText);
  return foundOption ? foundOption.color : (function() {
    const index = Math.abs(hashToNum(tagText)) % colors.length;
    return colors[index];
  })();
}

function getTagIcon(tagText: any, tagOptions: any[]) {
  const foundOption = tagOptions.find(option => option.label === tagText);
  return foundOption ? foundOption.icon : undefined;
}

const childrenMap = {
  text: TagsControl,
  tooltip: StringControl,
  tagColors: ColoredTagOptionControl,
};

const getBaseValue: ColumnTypeViewFn<typeof childrenMap, string | string[], string | string[]> = (
  props
) => props.text;

type TagEditPropsType = {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onChangeEnd: () => void;
};

export const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background: transparent !important;
  > div {
    width: 100%;
    height: 100%;
  }

  .ant-select {
    height: 100%;
    .ant-select-selector {
      padding: 0 7px;
      height: 100%;
      overflow: hidden;
      .ant-select-selection-item {
        display: inline-flex;
        align-items: center;
        padding-right: 24px;
      }
    }
    .ant-select-arrow {
      height: calc(100% - 3px);
      width: fit-content;
      top: 1.5px;
      margin-top: 0;
      background-color: white;
      right: 1.5px;
      border-right: 1px solid #d7d9e0;
      cursor: pointer;
      pointer-events: auto;
      svg {
        min-width: 18px;
        min-height: 18px;
      }
      &:hover svg path {
        fill: #315efb;
      }
    }
    .ant-select-selector .ant-select-selection-search {
      left: 7px;
      input {
        height: 100%;
      }
    }
    &.ant-select-open {
      .ant-select-arrow {
        border-right: none;
        border-left: 1px solid #d7d9e0;
        svg g path {
          fill: #315efb;
        }
      }
      .ant-select-selection-item {
        opacity: 0.4;
      }
    }
  }
  .ant-tag {
    margin-left: 20px;
  }
  .ant-tag svg {
    margin-right: 4px;
  }
`;

export const DropdownStyled = styled.div`
  .ant-select-item {
    padding: 3px 8px;
    margin: 0 0 2px 8px;
    border-radius: 4px;
  }
  .ant-select-item-option-content {
    display: flex;
    align-items: center;
  }
  .ant-tag {
    margin-right: 0;
  }
  .ant-tag svg {
    margin-right: 4px;
  }
`;

export const TagStyled = styled(Tag)`
  margin-right: 8px;
  svg {
    margin-right: 4px;
  }
`;

let tagOptionsList: any[] = [];

const TagEdit = (props: TagEditPropsType) => {
  const defaultTags = useContext(TagsContext);
  const [tags, setTags] = useState(() => {
    const result: string[] = [];
    defaultTags.forEach((item) => {
      if (item.split(",")[1]) {
        item.split(",").forEach((tag) => result.push(tag));
      }
      result.push(item);
    });
    return result;
  });
  const [open, setOpen] = useState(true);
  return (
    <Wrapper>
      <CustomSelect
        autoFocus
        defaultOpen
        variant="borderless"
        optionLabelProp="children"
        showSearch
        defaultValue={props.value}
        style={{ width: "100%" }}
        open={open}
        suffixIcon={<PackUpIcon />}
        onSearch={(value: string) => {
          if (defaultTags.findIndex((item) => item.includes(value)) < 0) {
            setTags([...defaultTags, value]);
          } else {
            setTags(defaultTags);
          }
          props.onChange(value);
        }}
        onChange={(value: string | string[]) => {
          props.onChange(value);
        }}
        dropdownRender={(originNode: ReactNode) => (
          <DropdownStyled>
            <ScrollBar style={{ maxHeight: "256px" }}>{originNode}</ScrollBar>
          </DropdownStyled>
        )}
        dropdownStyle={{ marginTop: "7px", padding: "8px 0 6px 0" }}
        onBlur={props.onChangeEnd}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.onChangeEnd();
          }
        }}
        onClick={() => setOpen(!open)}
      >
        {tags.map((value, index) => (
          <CustomSelect.Option value={value} key={index}>
            {value.split(",")[1] ? (
              value.split(",").map((item, i) => (
                <Tag color={getTagColor(item, tagOptionsList)} icon={getTagIcon(item, tagOptionsList)} key={i} style={{ marginRight: "8px" }}>
                  {item}
                </Tag>
              ))
            ) : (
              <Tag color={getTagColor(value, tagOptionsList)} icon={getTagIcon(value, tagOptionsList)} key={index}>
                {value}
              </Tag>
            )}
          </CustomSelect.Option>
        ))}
      </CustomSelect>
    </Wrapper>
  );
};

export const ColumnTagsComp = (function () {
  return new ColumnTypeCompBuilder(
    childrenMap,
    (props, dispatch) => {
      const tagOptions = props.tagColors;
      tagOptionsList = props.tagColors;
      let value = props.changeValue ?? getBaseValue(props, dispatch);
      value = typeof value === "string" && value.split(",")[1] ? value.split(",") : value;
      const tags = _.isArray(value) ? value : [value];
      const view = tags.map((tag, index) => {
        // The actual eval value is of type number or boolean
        const tagText = String(tag);
        return (
          <div>
            <TagStyled color={getTagColor(tagText, tagOptions)} icon={getTagIcon(tagText, tagOptions)} key={index} >
              {tagText}
            </TagStyled>
          </div>
        );
      });
      return (
        <Tooltip title={props.tooltip}>
          {view}
        </Tooltip>
      );
    },
    (nodeValue) => {
      const text = nodeValue.text.value;
      return _.isArray(text) ? text.join(",") : text;
    },
    getBaseValue
  )
    .setEditViewFn((props) => {
      const text = props.value;
      const value = _.isArray(text) ? text.join(",") : text;
      return <TagEdit value={value} onChange={props.onChange} onChangeEnd={props.onChangeEnd} />;
    })
    .setPropertyViewFn((children) => (
      <>
        {children.text.propertyView({
          label: trans("table.columnValue"),
          tooltip: ColumnValueTooltip,
        })}
        {children.tooltip.propertyView({
          label: trans("table.columnTooltip"),
          tooltip: ColumnValueTooltip,
        })}
        {children.tagColors.propertyView({
          title: "test",
        })}
      </>
    ))
    .build();
})();
