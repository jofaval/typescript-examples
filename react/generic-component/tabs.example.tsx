import React, { ReactNode, useState } from "react";

export type Tab<TSlug extends string, TChildProps> = {
  label: string;
  slug: TSlug;
  content: (props: TChildProps) => ReactNode;
  disabled?: boolean;
  hidden?: boolean;
};

export type TabsLayoutProps<
  TSlug extends string,
  TChildProps,
  TInitialSlug extends TSlug
> = {
  tabs: Tab<TSlug, TChildProps>[];
  childProps: TChildProps;
  initialTabSlug: TInitialSlug;
};

export function TabsLayout<
  TSlug extends string,
  TChildProps,
  TInitialSlug extends TSlug
>(props: TabsLayoutProps<TSlug, TChildProps, TInitialSlug>) {
  const [selectedTabSlug, setSelectedTabSlug] = useState<string>(
    props.initialTabSlug
  );
  const selectedTab = props.tabs.find((tab) => tab.slug === selectedTabSlug);

  const renderTab = (tab: Tab<TSlug, TChildProps>) => (
    <a
      onClick={(evt) => {
        evt.preventDefault();
        setSelectedTabSlug(tab.slug);
        return false;
      }}
    >
      {tab.label}
    </a>
  );

  return (
    <section className="tabs-layout">
      <nav className="tabs-layout__nav">
        {Array.isArray(props.tabs) ? props.tabs.map(renderTab) : null}
      </nav>

      <main className="tabs-layout__content">
        {selectedTab?.content(props.childProps)}
      </main>
    </section>
  );
}

export function App() {
  return (
    <div>
      <TabsLayout
        childProps={{ hello: "world", foo: "bar" }}
        tabs={[
          {
            content: (props) => <>{props.hello}</>,
            label: "Hello",
            slug: "hello",
          },
          {
            content: (props) => <>{props.foo}</>,
            label: "Foo",
            slug: "foo",
          },
        ]}
        initialTabSlug="foo"
      />

      <TabsLayout
        childProps={{ hello: "world", foo: "bar" }}
        tabs={[
          {
            content: (props) => <>{props.foo}</>,
            label: "Foo",
            slug: "foo",
          },
        ]}
        // @ts-expect-error
        initialTabSlug="hello"
      />
    </div>
  );
}
