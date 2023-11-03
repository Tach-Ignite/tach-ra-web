class InfoProps {
  [x: string]: any;
}

function Info() {
  const vars: any = { ...process.env };
  let result = '';
  Object.keys(vars).forEach((key) => {
    result += `<div>${key}: ${vars[key as keyof InfoProps]!.toString()}</div>`;
  });

  return <div dangerouslySetInnerHTML={{ __html: result }} />;
}

export default Info;
