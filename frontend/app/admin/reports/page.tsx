async function Page() {
  const reports = await fetch(`${process.env.INTERNAL_API_URL}/reports`); //TODO: finish displaying reports

  return <div>Reports coming soon!</div>;
}

export default Page;
