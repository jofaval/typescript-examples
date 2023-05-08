import React, { FC } from "react";

export type Role = "user" | "admin" | "manager";

export type MandatoryProps = {
  authToken: string;
  roles: Role[];
};

export type ParentComponentProps = {
  // authUrl: string
  renderer: FC<MandatoryProps>;
};

const ultraSecretHiddenProps: MandatoryProps = {
  authToken: "WKEJNTIK23TH23IUH928FGQAHG21",
  roles: ["admin", "manager"],
};

export function ParentComponent({ renderer: Children }: ParentComponentProps) {
  return <div>{<Children {...ultraSecretHiddenProps} />}</div>;
}

export const ChildrenComponent: FC<MandatoryProps> = (props) => {
  return (
    <>
      <span>{props.authToken}</span>

      <div>
        {props.roles.map((role) => (
          <>{role}</>
        ))}
      </div>
    </>
  );
};

export const InvalidChildrenComponent: FC = () => {
  return <></>;
};

export function App() {
  const successfulChildren = <ParentComponent renderer={ChildrenComponent} />;
  // @ts-expect-error
  const failedChildren = (
    <ParentComponent renderer={InvalidChildrenComponent} />
  );

  return (
    <div>
      {successfulChildren}
      <br />
      {failedChildren}
    </div>
  );
}
