import styled from "styled-components";
import { trans } from "../../i18n";
import { default as Divider } from "antd/es/divider";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getHomeOrg } from "redux/selectors/applicationSelector";
import history from "util/history";
import { ALL_APPLICATIONS_URL, ORG_HOME_URL } from "constants/routesURL";
import { default as AntdBreadcrumb } from "antd/es/breadcrumb";
import { ArrowIcon } from "lowcoder-design";
import { Card } from "antd";
import { useRef } from "react";
import { LowcoderAppView } from "appView/LowcoderAppView";

import { SERVER_HOST } from "constants/apiConstants";
import { sdkConfig } from "constants/sdkConfig";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const HeaderWrapper = styled.div`
  height: 84px;
  width: 100%;
  display: flex;
  padding: 0 36px;
  align-items: center;
  flex-shrink: 0;
  @media screen and (max-width: 500px) {
    padding: 0 24px;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
`;


const OrgView = styled.div`
  font-size: 14px;
  color: #8b8fa3;
  flex-grow: 1;
  padding-top: 0px;
  padding-left: 40px;
  max-width: 95%;
`;

const StyleOrgCover = styled.div`
    background: rgb(2,0,36);
    background: -moz-linear-gradient(141deg, rgba(2,0,36,1) 0%, rgba(9,44,121,1) 35%, rgba(11,214,232,1) 100%);
    background: -webkit-linear-gradient(141deg, rgba(2,0,36,1) 0%, rgba(9,44,121,1) 35%, rgba(11,214,232,1) 100%);
    background: linear-gradient(141deg, rgba(2,0,36,1) 0%, rgba(9,44,121,1) 35%, rgba(11,214,232,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#020024",endColorstr="#0bd6e8",GradientType=1);
    padding: 25px;
    height: 120px;
    border-radius:10px 10px 0 0;
`;

const StyleOrgContent = styled.div` 
    position: relative;
    margin-top:-50px;
    display: flex;
    align-items: end;
    gap: 20px;

    .subtitle {
        color: #8b8fa3;
    }

    .button-end {
        margin-left: auto;
    }
    
    svg {
        margin-right: 5px;
        vertical-align: middle;
    }
`;

const Breadcrumb = styled(AntdBreadcrumb)`
  font-size: 20px;

  li:not(:last-child) {
    color: #8b8fa3;
  }

  li:last-child {
    font-weight: 500;
    color: #222222;
  }

  li.ant-breadcrumb-separator {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const BreadcrumbItem = styled.div`
  cursor: pointer;
`;

const isSelfHost = window.location.host !== 'app.lowcoder.cloud';

export type OrgLayoutBreadcrumbType = { text: string; path: string };
export type OrgLayoutLayoutMode = "view";

export interface OrgLayoutLayoutProps {
  breadcrumb?: OrgLayoutBreadcrumbType[];
}

export function OrgLayout(props: OrgLayoutLayoutProps) {

  const { breadcrumb = []} = props;
  const currentPath = useLocation().pathname;

  const breadcrumbItems = [
    {
      key: 0,
      title: trans("home.home"),
      onClick: () =>
        currentPath !== ALL_APPLICATIONS_URL && history.push(ALL_APPLICATIONS_URL),
    },
    {
      key: 1,
      title: trans("home.yourOrg"),
      onClick: () =>
        currentPath !== ORG_HOME_URL && history.push(ORG_HOME_URL),
    },
    ...breadcrumb.map((b, i) => ({
      key: i+1,
      title: b.text,
      onClick: () => currentPath !== b.path && history.push(b.path)
    }))
  ];

  const currentOrg = useSelector(getHomeOrg);
  const appRef = useRef();
  const baseURL = sdkConfig.baseURL || SERVER_HOST;
  const defaultHomePage =  currentOrg?.commonSettings.defaultHomePage;

  return (
    <Wrapper>
      <HeaderWrapper>
        <Breadcrumb
          separator={<ArrowIcon />}
          items={breadcrumbItems}
          itemRender={(item) => (
            <BreadcrumbItem
              key={item.key}
              onClick={item.onClick}
            >
              {item.title}
            </BreadcrumbItem>
          )}
        >
        </Breadcrumb>
      </HeaderWrapper>

      <ContentWrapper>
        <OrgView>
          <StyleOrgCover>
            <h1 style={{color: "#ffffff", marginTop : "12px"}}>{trans("home.orgHomeTitle")}</h1>
          </StyleOrgCover>
          <Card style={{ marginBottom: "20px" }}>
            
            <h3 style={{color: "#444", marginTop : "12px"}}>{currentOrg?.name}</h3>

            <Divider />

            { defaultHomePage ?  
              <LowcoderAppView
                ref={appRef}
                appId={defaultHomePage || ""}
                baseUrl={baseURL}
              />
              : 
              <div>Keine Default Homepage</div>
            }

          </Card>  
          
        </OrgView>
      </ContentWrapper>
    </Wrapper>
  );
}
