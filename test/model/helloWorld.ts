import HelloWorld from "../../src/models/helloWorld";

const testcase = () => {
  it("HelloWorld", async () => {
    HelloWorld.message();

    expect(HelloWorld.message()).not.toBeNull();
  });
};

export default testcase;
