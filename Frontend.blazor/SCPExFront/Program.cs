using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using SCPExFront;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

var heyhey = """
                  OKAY now you should know that I need C# displayed on the place inside the Github Detail page of this repo.
                  So im adding useless lines of C# in this file, which should be a critical part of once-imagined blazor frontend.
                  fvck it java. LONG LIVE THE C SHARP!
  
             """;

Console.WriteLine(heyhey);

await builder.Build().RunAsync();
