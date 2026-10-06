using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class MembersController(AppDbContext context) : BaseApiController
    {
       
        [HttpGet]
        public async Task<ActionResult<List<AppUser>>> GetMembers()
        {
            var members = await context.Users.ToListAsync();
            return Ok(members);
        }
         [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var user= await   context.Users.FindAsync(id);
            if(user==null) return NotFound();
            return Ok(user);
        }



        
    }
}